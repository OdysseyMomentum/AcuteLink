from flask import Flask, render_template
app = Flask(__name__)


@app.route('/gp')
def hello():
    return render_template('gp.html')

if __name__ == '__main__':
    app.run()
