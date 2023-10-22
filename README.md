# Attendance_Portal
To view the hosted version Click here : https://attendance-portal-frontend-kzx9.onrender.com

###### Youtube Link : [Click Here ](https://www.youtube.com/watch?v=S_P_fyYYrJI)

## Instructions 
In backend, database/connection.js change the connection database as required for local setup.
In frontend, config.js change ENV to 'DEV' from 'PROD'.

## RUN PORT SERVERS OF BOTH BACKEND AND FRONTEND
- Open backend seperately and type in terminal : ``` npm start ```
- Open frontend seperately and type in terminal: ``` npm start ```


## Short description
- The attendance portal website was created to make a dynamic attendance maintenance. <br>
- The frontend was made using React and backend was done using Node.js and I have used MySQL for database. The database is hosted in AWS RDS. <br>
- There are two types of users : professors and students. <br>
- The student user after logging in can see timetable and list of courses where he can see his course attendance. Student can also send enquiry regarding attendance in their respective courses.<br>
- The professor after logging in can assign student courses , mark attendance in a course of that day and update attendance. In the enquiry section he can reply back to students enquiries either by  accepting or rejecting their requests. <br>
- Both backend and frontend are hosted in render and MySQL instance is hosted in AWS RDS (service)

