from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup
import os

app = Flask(__name__)

mongodb_uri = os.environ.get('MONGODB_URI')

client = MongoClient(mongodb_uri)
db = client.dbsparta

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/content", methods=["POST"])
def content_post():
    url_receive = request.form['url_give']
    comment_receive = request.form['comment_give']
    star_receive = request.form['star_give']

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    ogtitle = soup.select_one('meta[property="og:title"]')['content']
    ogimage = soup.select_one('meta[property="og:image"]')['content']
    ogdesc = soup.select_one('meta[property="og:description"]')['content']

    doc = {
        'title': ogtitle,
        'desc': ogdesc,
        'image': ogimage,
        'comment': comment_receive,
        'star': star_receive
    }
    db.contents.insert_one(doc)

    return jsonify({'msg': 'Saved!'})

@app.route("/content", methods=["GET"])
def content_get():
    all_contents = list(db.contents.find({}, {'_id': False}))
    return jsonify({'result': all_contents})

@app.route("/content/<title>", methods=["DELETE"])
def content_delete(title):
    db.contents.delete_one({'title': title})
    return jsonify({'msg': 'Deleted!'})

@app.route("/content/<title>", methods=["PUT"])
def content_update(title):
    comment_receive = request.form['comment_give']
    star_receive = request.form['star_give']
    
    db.contents.update_one(
        {'title': title},
        {'$set': {'comment': comment_receive, 'star': star_receive}}
    )
    return jsonify({'msg': 'Updated!'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
