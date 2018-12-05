# I can be your Heroku, baby
*How to deploy a Python app in Heroku*

Do you like Data Science? (Shakes head up and down). Do you not like Data Science DIY deployment apps? (Shakes head left and right). Me neither!

One of the most frustrating parts of early data science learning  or personal work is deploying an app through free cloud applications. Your code is juuust the tops and works like a charm locally. I believe you. So why is it blowing up every time you attempt to push it to the cloud?

Of course, I’m talking specifically about Heroku. There are a billion guides out there, and yet everyone I know runs into issues every time we try to deploy a Python app. Our Flask apps work just fine on local Python servers, but the seemingly easy Heroku setup would crash during ‘create’ or ‘open’ leaving us punching walls and yelling at … inanimate objects. 

Anyway, the point is that Heroku is incredibly temperamental. If one step is done incorrectly, chances are the deployment will flop and thusly the app will tank. Early on in fact, my efforts would get so murky so quickly, I would just delete the app on Heroku and start from scratch. 

Boys and girls, let my monkeys be your circus. Or whatever. The following is a guide **for Python apps** to guide you where I failed.

1. Prepare your application
2. Create the Heroku app
3. Push to Heroku via Git

## First, Sample Code & Sample App

Feel free to fork this repo and try on your own.  It’s a ridiculous data set about belly buttons, but it’s simplicity and complexity make it a prime candidate for this tutorial.

https://github.com/jeffreybox/PyHeroku

<PIC: heroku_app>

## 1. Preparing your application

**Create a clean Python environment**

Like most projects, it’s best if you start with a fresh environment, so go ahead and create, copy, or install an environment. I’m using Conda here.

```$conda create --name env_name
Or clone your existing working environment
```$conda create --name env_name --clone other_env

```$source activate env_name

You can always view your list of environments with

```$conda env list

More on managing Conda environments: 
https://conda.io/docs/user-guide/tasks/manage-environments.html

*Note: if you are using the sample code in PyHeroku, skip the next step and build the environment on the requirements.txt file*. 

```$conda install --yes --file requirements.txt 

**Install all necessary libraries** 

Sometimes creating a fresh python environment won’t contain the basic libraries standard with your root environment. Why? Dunno. Doesn’t matter. I’ve just noticed that over the aeons. Therefore, make sure you’ve got everything installed in your environment required to run your app. 

Check packages by calling the following script in the active environment

```$conda list 

If you’re missing essentials (e.g. pandas) or anything else (e.g. Flask, Flask-SQLAlchemy), pip or conda install now. After it’s all cozy, we need two more packages that are likely not installed if you are a Heroku noob. Herokoob.    

* **Install Gunicorn**. 

This library is a high performance web server that can run their Flask app in a production environment. I’m not going into any more detail on ‘how’, but this is what makes the app work. In your environment:

```$pip install gunicorn 

* **Install psycopg2** 
if your app utilizes a local database 

```$pip install psycopg2

**Debug the app**

Never forget the obvious. *Make sure your project runs locally*. Since I’m using Flask for the example, simply `Flask run` your app.py. If there are issues, ensure the Flask app is initialized, routed, and deployed correctly. Examples include

app = Flask(__name__)

@app.route('/')
def home():
    return “Hello, Jeff Box”

if __name__ == '__main__':
    app.run(debug=True)

**Create necessary project files**

Now, we need to generate two files in the same directory as our app.py. These are 1) the Procfile and 2) the `requirements.txt` file. Both of these are required by Heroku to install all app dependencies and subsequently utilize Gunicorn to fire off our app in the cloud. First create the Procfile.

```$touch Procfile

Open the procfile with the terminal, a code editor, a text editor, and simply add the following script

```web gunicorn app:app

If your app happens to be in a different subdirectory, the deployment will fail. You can skirt around this issue by modifying the script to read “gunicorn subdirectory.app:app” or the like, but I don’t recommend it. Just keep it all in the root directory.

<PIC: Procfile>

Finally, we create the requirements.txt file by 

```$pip freeze > requirements.txt`

*Note that these files already exist in the PyHeroku repo*

## 2. Creating the Heroku app

**Getting started**

Uhhh… create a Heroic account if you don’t have one.

https://www.heroku.com/

**Create a new app**

Once you have an account, click on `New` >`Create new app`
You will always create a new `app` for each app you deploy.

In the next screen, create your `App name`. 

**IMPORTANT!!!!**: this is where a lot of folks screw up. The name must be unique to Heroku, but the name must also match the name of your local project directory (that directory that contains the app.py, procfile, requirements files). In the screenshots below, the heroku app name is ‘PyHeroku’; the directory name is ‘PyHeroku’. Got it? 

<PIC: files>

But do you f’real got it? Because if you end up needing to modify your directory name due to a Heroku app name not being available, this could create issues with Github or any other code dependencies. Now you see where something very simple can waste hours of your life.

Once that’s sorted out, click on `Create app`. 

**Configuring the Heroku app for your database**

We’ll configure Heroku to use Postgres on its end. Navigate to the `Resources` tab. In the `Add-ons` search bar, type `Heroku Postgres`. It will pop up. Add it, but make sure to use the free version! Feel free to lol super hard at the pricing structure.

Next, click on the ‘Settings’ tab, and then navigate to the `Reveal Config Variables` button.

The connection string to the database should now be available:
Heroku will automatically assign this URI string to the `DATABASE_URL` environment variable that is used within your `app.py` file. The code that is already in `app.py` will be able to use that environment variable to connect to the Heroic database. If you’re using SQLAlchemy in your Python code, it might look something like this within app.py

```app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
db = SQLAlchemy(app)
…

If this doesn’t look familiar, or you’re not specifically initializing a database, chances are you will not need to screw around with the config variables or this code. Let’s move on.

## 3. Pushing to Heroku via Git

Hooray! We’re almost there.

There are a few ways you can do this next part, but let’s take the easy path and use Heroku Git. Navigate to the “Deploy” tab, and you’ll see information about pipelines along with the following:

<PIC>

Selecting Heroku Git gives you CLI instructions; however, I’ve outlined them below. 

**Heroku Git**
In your CLI, make sure everything is still running smoothly and that you are still in your appropriate environment. Then execute the following line by line

$git init
$git add .
$git commit -m "init repo"
$heroku create
$git push heroku master
$heroku open
```

YOUR BROWSER SHOULD OPEN THE FUNCTIONING APP! YOU DID IT! REWARD YOURSELF BY TAKING A LONG WALK IN THE SOUTH OF FRANCE, LISTENING TO JOHN TESH WHILE TAKING A BUBBLE BATH, OR CREATING A WHOLE NEW HEROKU APP JUST BECAUSE YOU CAN!!!

But just for solidarity, here’s how to use Github instead of updating and pushing to Heroku git with every minor change and update. 

**Else, Github**
 I haven’t had much luck with this @route… get it…? … -_-

Anyway, to do so, in deployment tab where we selected Heroku Git

* select `Connect to Github`, and click the button at the bottom.
* In the field `repo-name`, enter the name of your Github repo, and click `Search`.
* Click `Connect` to link your Heroku app with your Github repo.
* Click on `Enable Automatic Deploys`, which will allow the Heroku server to restart your app whenever you push a change to your Github repo.
* Finally, click on the `Resources` tab, followed by clicking the `edit` button with the pencil icon.
* Slide the worker switch to the right, then click on `Confirm`.
* Cross your fingers and pray to deity of choice

Like I said, I recommend the first method.

*Good luck. We’re all counting on you, Heroku*.

Jeffrey Box
