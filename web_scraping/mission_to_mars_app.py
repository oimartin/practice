# 1. import Flask and other dependencies
from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
from splinter import Browser
from bs4 import BeautifulSoup as bs
import pymongo
import pandas as pd
import scrape_mars

# 2. Create an app, being sure to pass __name__
app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/mars_data"
mongo = PyMongo(app)


# 3. Define what to do when a user hits the index route
@app.route("/")
def home():
    scrape_dictionary = mongo.db.listings.find_one()
    return render_template("mission_to_mars_index.html", listings=scrape_dictionary)


@app.route("/scrape")
def scraper():
    scrape_dictionary = mongo.db.listings
    scrape_dictionary_data = scrape_mars.scrape()
    scrape_dictionary.update({}, scrape_dictionary_data, upsert=True)
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)