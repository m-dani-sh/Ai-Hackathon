from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

# Initialize DB
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS rides (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            driver_name TEXT,
            route TEXT,
            time TEXT,
            seats INTEGER,
            booked_seats INTEGER DEFAULT 0,
            start_lat REAL,
            start_lng REAL,
            end_lat REAL,
            end_lng REAL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Home
@app.route('/')
def index():
    return render_template('index.html')

# Post Ride
@app.route('/post_ride', methods=['GET','POST'])
def post_ride():
    if request.method=='POST':
        driver_name = request.form['driver_name']
        route = request.form['route']
        time = request.form['time']
        seats = int(request.form['seats'])
        start_lat = float(request.form['start_lat'])
        start_lng = float(request.form['start_lng'])
        end_lat = float(request.form['end_lat'])
        end_lng = float(request.form['end_lng'])

        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute('''INSERT INTO rides 
            (driver_name, route, time, seats, start_lat, start_lng, end_lat, end_lng)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
            (driver_name, route, time, seats, start_lat, start_lng, end_lat, end_lng))
        conn.commit()
        conn.close()
        return redirect(url_for('index'))
    return render_template('post_ride.html')

# Search Rides
@app.route('/search_rides', methods=['GET','POST'])
def search_rides():
    rides = []
    if request.method=='POST':
        route = request.form['route']
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute("SELECT * FROM rides WHERE route LIKE ?", ('%' + route + '%',))
        rides = c.fetchall()
        conn.close()
    return render_template('search_rides.html', rides=rides)

# Book Seat
@app.route('/book/<int:ride_id>')
def book_seat(ride_id):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT seats, booked_seats FROM rides WHERE id=?", (ride_id,))
    ride = c.fetchone()
    if ride and ride[1]<ride[0]:
        c.execute("UPDATE rides SET booked_seats = booked_seats + 1 WHERE id=?", (ride_id,))
        conn.commit()
    conn.close()
    return redirect(url_for('search_rides'))

# Ride History
@app.route('/ride_history')
def ride_history():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM rides ORDER BY time DESC")
    rides = c.fetchall()
    conn.close()
    return render_template('ride_history.html', rides=rides)

if __name__ == '__main__':
    app.run(debug=True)
