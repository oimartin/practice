# Import dependencies
from splinter import Browser
from bs4 import BeautifulSoup as bs
import pymongo
import pandas as pd

def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=True)

def scrape(): 
    browser = init_browser()
    listings = {}

    ## -- Look at news page for Mars from NASA -- ##
    url = "https://mars.nasa.gov/news/"
    browser.visit(url)
    html = browser.html

    # Create a Beautiful Soup object
    soup = bs(html, 'html.parser')

    # Collect latest news title
    news_title = soup.find_all('div', class_="content_title")

    # Collect latest new paragraph
    news_p = soup.select('ul.item_list li.slide div.article_teaser_body')


    ## -- URL of Mars Images website -- ##
    img_url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(img_url)

    img_html = browser.html
    # Create a Beautiful Soup object 
    img_soup = bs(img_html, 'html.parser')

    # Collect current featured Mars image
    first_img = img_soup.select_one('div.image_and_description_container div.img img.thumb')
    first_img_src = first_img['src']

    base_img_url = 'https://www.jpl.nasa.gov/spaceimages/images/largesize'
    featured_img_url = base_img_url + first_img_src 


    ## -- URL of Mars Weather twitter page -- ##
    twitter_url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(twitter_url)

    twitter_html = browser.html

    # Create a Beautiful Soup object
    tweet_soup = bs(twitter_html, 'html.parser')

    # Save text from mars weather latest tweet
    mars_weather_tweet = tweet_soup.find('p', class_='TweetTextSize TweetTextSize--normal js-tweet-text tweet-text').text


    ## -- URL of Space Facts - Mars Facts -- ##
    facts_url = "https://space-facts.com/mars/"

    # Read tables from Space Facts with pandas
    facts_table = pd.read_html(facts_url)
    facts_table

    # Create DataFrame from first table found
    facts_df = facts_table[0]

    # Convert facts_df to html string
    facts_html_table = facts_df.to_html()

    # Get rid of any extra newlines to clean up table
    facts_html_table = facts_html_table.replace('\n', '')


    ## -- USGS Astrogeology website -- ##
    hemisphere_url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(hemisphere_url)

    hemisphere_html = browser.html

    # Create Beautiful Soup object
    hemisphere_soup = bs(hemisphere_html, 'html.parser')

    # Create list to save titles/captions of mars hemispheres
    hemisphere_captions = hemisphere_soup.select("a.itemLink  h3")
    captions = []
    for attribute in hemisphere_captions:
        caption = attribute.text
        captions.append(caption)

    # Create list to save high def images of mars hemispheres
    hemisphere_urls = hemisphere_soup.select('div.item div.description a')
    urls = []

    # Perform for loop to iterrate and click through each link to the 
    # high def image link and save link
    for x in hemisphere_urls:
        url = x['href']
        
    #   Create new url to access high def image
        enhanced_url = 'https://astrogeology.usgs.gov' + url
        browser.visit(enhanced_url)
        
        enhanced_html = browser.html
        enhanced_soup = bs(enhanced_html, 'html.parser')
        
    #   Use enhanced_soup object to find link to high def image
        almost_img = enhanced_soup.select_one('div.downloads ul li a')
        enhanced_img = almost_img['href']
        
    #   Add full enhanced_img_url to the urls list
        urls.append(enhanced_img)

        # Create list of dictionaries for each hemisphere caption and url
    hemisphere_1 = {'title': captions[0], 'img_urls': urls[0]}
    hemisphere_2 = {'title': captions[1], 'img_urls': urls[1]}
    hemisphere_3 = {'title': captions[2], 'img_urls': urls[2]}
    hemisphere_4 = {'title': captions[3], 'img_urls': urls[3]}

    # Put hemisphere dictionaries into a list
    hemisphere_image_urls = [hemisphere_1, hemisphere_2,
                            hemisphere_3, hemisphere_4]
    

    ## -- Put all scraped data into one dictionary -- ##
    scrape_dictionary = dict({'News_P': news_p, 
        'News_Title': news_title, 
        'Feature_Img_Url': featured_img_url, 
        'Tweet': mars_weather_tweet, 
        'Facts_Table': facts_html_table,
        'Imgs of Hemisphere': hemisphere_image_urls})

    return(scrape_dictionary)
