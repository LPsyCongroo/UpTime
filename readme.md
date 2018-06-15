# Uptime

A REST API that checks to see if websites are up and sends the user an SMS message.

## Motivation

This is mostly a practice project, to see how much functionality I can squeeze out of Node's native modules. Aside from eslint, there are no external libraries. However, I may add Jest later, as I find Node's own assertion library to be kind of clunky. We'll see. 

I'm hoping to take what I learned and put it into a series of blog articles on Node that I've been planning for some time now (you can see some of my notes [here](https://github.com/LPsyCongroo/freeCodeCampMeetup)

### Note: 

You may have noticed that the code follows the wonderful Callback Christmas Tree from Hell pattern. I learned and integrated promises so early on in my workflow, I never really got a chance to compare the full effect they can have in my own actual code. Hence, once the REST API is fully functional, I'll be making another branch refactored with promises. This by itself will likely be the subject of a full blog article.