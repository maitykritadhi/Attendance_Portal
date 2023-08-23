const uuid = require("uuid");

const pool = require("../database/connection");
const bcrypt = require("bcrypt");
const { validateUser } = require("../util/util");

const profSignUp = async (req, res) => {
  try {
    const { name, phone, mail, password } = req.body;
    if (!name || !phone || !mail || !password) {
      console.log("Missing parameters");
      res.status(404).json({ message: "Please submit all valid parameters!" });
    } else {
      // Check if the email already exists in the database
      await pool.query(
        "SELECT * FROM professor WHERE mail = ?",
        [mail],
        async (error, result) => {
          if (result[0]) {
            //   console.log(result[0]);
            return res
              .status(409)
              .json({ error: mail + " :Email already exists!!" });
          } else {
            // If email is not taken, bcrypt the user's password before storing it in the database
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // // Create a new user in the database
            await pool.query(
              "INSERT INTO professor (name, phone, mail, password ) VALUES (?, ?, ?, ?)",
              [name, phone, mail, hashedPassword]
            );

            // Registration successful
            res.status(200).json({ message: "Registration successful" });
          }
        }
      );
    }
  } catch (error) {
    // Handle any errors that occurred during the database operations
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const profLogin = async (req, res) => {
  try {
    const { mail, password } = req.body;
    if (!mail || !password) {
      console.log("Missing parameters");
      res.status(404).json({ message: "Please submit all valid parameters!" });
    } else {
      // Check if the email already exists in the database
      await pool.query(
        "SELECT id,mail,password FROM professor WHERE mail = ?",
        [mail],
        async (error, result) => {
          if (!result[0]) {
            console.log("Mail not present in db");
            res.status(404).json({ message: "Email not present in db" });
          } else {
            if (!validateUser(password, result[0].password)) {
              console.log("Wrong Password!");
              res.status(401).json({ message: "Wrong Password!" });
            } else {
              const myuuid = uuid.v4();
              // console.out("Your UUID is: " + myuuid);
              await pool.query(
                "SELECT * FROM session_table WHERE user_id = ?",
                [result[0].id],
                async (error, result1) => {
                  if (result1[0]) {
                    await pool.query(
                      "UPDATE session_table SET session_tokens = ? WHERE user_id = ?",
                      [myuuid, result[0].id]
                    );
                  } else {
                    await pool.query(
                      "INSERT INTO session_table (session_tokens,flag,user_id) VALUES (?,?,?)",
                      [myuuid, 1, result[0].id]
                    );
                  }
                }
              );
              res.status(200).json({
                message: "Logged in Successfully",
                session_token: myuuid,
              });
            }
          }
        }
      );
      // im  here
    }
  } catch (error) {
    // Handle any errors that occurred during the database operations
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const profGetCourse = async (req, res) => {
  try {
    const userId = req.userId;
    await pool.query(
      "SELECT id,cid,cname FROM courses WHERE prof_id = ?",
      [userId],
      async (error, result) => {
        if (error) {
          res.send({ message: "database error" });
        } else if (!result[0]) {
          console.log("Bad request");
          res.status(400).json({ error: "Bad Request" });
        } else {
          console.log(result);
          res.send(result);
        }
      }
    );
  } catch {
    // Handle any errors that occurred during the database operations
    console.error("Error during getting course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const profGetStudents = async (req, res) => {
  try {
    const courseId = req.headers.course_id;
    await pool.query(
      "SELECT students.id, students.name, students.roll FROM attenendance.students WHERE students.id NOT IN (SELECT student_course_mapped.stud_id FROM attenendance.student_course_mapped WHERE student_course_mapped.course_id = ?)",
      [courseId],
      async (error, result) => {
        if (error) {
          res.send({ message: "database error" });
        } else {
          console.log(result);
          res.send(result);
        }
      }
    );
  } catch {
    // Handle any errors that occurred during the database operations
    console.error("Error during getting students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const profAssignStudents = async (req, res) => {
  // res.send({message: "Checking Auth function"});
  try {
    const { cid, sid } = req.body;
    // console.log(sid.length);
    if (!cid || !sid) {
      console.log("Missing parameters");
      res.status(404).json({ message: "Please submit all valid parameters!" });
    } else if (!sid.length) {
      console.log("No Students to assign");
      res.status(404).json({ message: "No Students to assign!" });
    } else {
      let str = "";
      for (let i = 0; i < sid.length; i++) {
        str += "(";
        str += sid[i].toString();
        str += ",";
        str += cid.toString();
        str += "),";
      }
      str = str.slice(0, -1); // Remove the last character

      // let s1 = "INSERT INTO student_course_mapped (stud_id,course_id) VALUES ";
      // console.log(s1+str);
      await pool.query(
        `INSERT INTO student_course_mapped (stud_id,course_id) VALUES ${str}`,
        async (error, result) => {
          if (error) {
            console.log(error);
            res.send({ message: "database error" });
          } else {
            console.log("Successfully assigned course to students!!");
            res.send({ message: "Successfully assigned course to students!!" });
          }
        }
      );
    }
  } catch (error) {
    // Handle any errors that occurred during the database operations
    console.error("Error during assigning students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Mark Attendance
const profChooseDate = async (req, res) => {
  try {
    await pool.query("SELECT * FROM days_mapped", async (error, result) => {
      if (error) {
        console.log(error);
        res.send({ message: "database error" });
      } else {
        console.log(result);
        res.send(result);
      }
    });
  } catch (error) {
    // Handle any errors that occurred during the database operations
    console.error("Error during choosing date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const profChooseCourse = async (req, res) => {
  try {
    const dayid = req.headers.dayid;
    const userId = req.userId;
    await pool.query(
      "SELECT id,cid,cname FROM attenendance.courses WHERE prof_id = ? AND id IN (SELECT cid FROM attenendance.timetable WHERE dayid = ?)",
      [userId, dayid],
      async (error, result) => {
        if (error) {
          console.log(error);
          res.send({ message: "database error" });
        } else {
          console.log(result);
          res.send(result);
        }
      }
    );
  } catch (error) {
    // Handle any errors that occurred during the database operations
    console.error("Error during choosing course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const profGetStudentList = async (req, res) => {
  try {
    const cid = req.headers.cid;
    await pool.query(
      "SELECT id,name,roll,mail FROM students WHERE id IN (SELECT stud_id FROM student_course_mapped WHERE course_id = ?)",
      [cid],
      async (error, result) => {
        if (error) {
          console.log(error);
          res.send({ message: "database error" });
        } else {
          console.log(result);
          res.send(result);
        }
      }
    );
  } catch (error) {
    // Handle any errors that occurred during the database operations
    console.error("Error during getting Student list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const profMarksAttendance = async (req, res) => {
  try {
    const sid_list = req.body.stud_id;
    const attend_student_list = req.body.attend_list;
    const course_id = req.headers.courseid;
    if (!sid_list) {
      console.log("No students list provided!!");
      res.status(404).json({ message: "No students list provided!!" });
    } else if (sid_list.length == 0) {
      console.log("List size zero!!");
      res.status(404).json({ message: "List Size zero!!" });
    } else {
      let str = "";
      for (let i = 0; i < sid_list.length; i++) {
        str += "(";
        str += "CURDATE()";
        str += ",";
        str += sid_list[i].toString();
        str += ",";
        str += course_id.toString();
        str += ",";
        str += "'" + attend_student_list[i] + "'";
        str += "),";
      }
      str = str.slice(0, -1); // Remove the last character
      // let s1 = "INSERT INTO mark_attendance (date,stud_id,course_id,attendance) VALUES ";
      // console.log(s1+str);
      await pool.query(
        `INSERT INTO mark_attendance (date,stud_id,course_id,attendance) VALUES ${str}`,
        async (error, result) => {
          if (error) {
            console.log(error);
            res.status(400).json({ error: "SQL error!!" });
          } else {
            console.log("Successfully marked attendance!!");
            res.send({ message: "Successfully marked attendance!!" });
          }
        }
      );
    }
  } catch (error) {
    // Handle any errors that occurred during the database operations
    console.error("Error during marking attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Attendance

const updateprofchooseDate = async (req, res) => {
  const dateStr = req.headers.sdate;
  const date = new Date(dateStr);

  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayOfWeekIndex = date.getDay();
  const dayOfWeek = daysOfWeek[dayOfWeekIndex];
  // console.log(dayOfWeek); // Output: Wednesday
  try {
    await pool.query(
      "SELECT dayid FROM days_mapped WHERE dayname = ?",
      [dayOfWeek],
      async (error, result) => {
        if (error) {
          console.log(error);
          res.send({ message: "database error" });
        } else {
          console.log(result[0]);
          res.send(result[0]);
        }
      }
    );
  } catch (error) {
    // Handle any errors that occurred during the database operations
    console.error("Error during updating choosing date option", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const updateProfFetchStudentList = async(req,res) => {
  try{
    const cid = req.headers.cid;
    const date = req.headers.sdate;
    await pool.query(
      "SELECT s.id,s.name,s.roll, ma.attendance FROM students s JOIN mark_attendance ma ON s.id = ma.stud_id WHERE ma.course_id = ? AND ma.date = ?",
      [cid,date],
      async(error,result) => {
        if(error){
          console.log(error);
          res.send({ message: "database error" });
        }else{
          console.log(result);
          res.send(result);
        }
      }
    );
  }catch(error){
    // Handle any errors that occurred during the database operations
    console.error("Error during updating fetching student list!!", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const profUpdatesAttendance = async(req,res) => {
  try{
    const data = req.body;
    const date = req.headers.ma_date;
    const cid = req.headers.ma_courseid;
    if(!data){
      console.log("No students list provided!!");
      res.status(404).json({ message: "No students list provided!!" });
    }else if(data.length == 0){
      console.log("List size zero!!");
      res.status(404).json({ message: "List Size zero!!" });
    }else{
      let str = "";
      for (let i = 0; i < data.length; i++) {
        str += `UPDATE mark_attendance SET attendance ='${data[i].attendance}' WHERE stud_id =${data[i].stud_id} AND date = '${date}' AND course_id = '${cid}';`;
      }
      console.log(str);
      // let str = "";
      // for(let i=0; i<data.length; i++){
      //   str += "UPDATE mark_attendance SET attendance = ";
      //   str += "'";
      //   str += data[i].attendance;
      //   str += "'";
      //   str += " WHERE stud_id = ";
      //   str += data[i].stud_id;
      //   str += "; "
      // }
      // console.log(str);
      await pool.query(
        str,
        async(error,result) => {
          if (error) {
            console.log(error);
            res.send({ message: "database error" });
          } else {
            console.log("Successfully updated attendance!!");
            res.send({ message: "Successfully updated attendance!!" });
          }
        }
      );
    }
  }catch(error){
    // Handle any errors that occurred during the database operations
    console.error("Error during updating fetching student list!!", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const profRequestReceive = async(req,res) => {
  try{
    const sid = req.userId;
    await pool.query(
      "SELECT r.id,r.stud_mssg,r.stud_id,s.name,s.roll,s.mail,r.prof_id,r.state,r.course_id FROM request r JOIN students s ON r.stud_id = s.id WHERE r.prof_id = ? AND r.state = 0",
      [sid],
      async (error, result) => {
        if (error) {
          console.log(error);
          res.send({ message: "database error" });
        } else {
          console.log(result);
          res.send(result);
        }
      }
    );
  }catch(error){
    // Handle any errors that occurred during the database operations
    console.error("Error during prof request handling!!", error);
    res.status(500).json({ error: "Error during prof request handling" });
  }
};

const profRequestUpdate = async(req,res) => {
  try{
    const id = req.body.id;
    const prof_mssg = req.body.prof_mssg;
    // const stud_id = req.body.stud_id;
    // const prof_id = req.body.prof_id;
    const state = req.body.state;
    if (!id || !state) {
      console.log("Missing parameters");
      res.status(404).json({ message: "Missing Parameters!!!" });
    }else{
      await pool.query(
        "UPDATE request SET prof_mssg = ?, state = ? WHERE id = ?",
        [prof_mssg, state,id],
        async (error, result) => {
          if (error) {
            console.log(error);
            res.send({ message: "database error" });
          } else {
            console.log("Successfully updated student request by prof!!");
            res.send({
              message: "Successfully updated student request by prof!!",
            });
          }
        }
      );
    }
  }catch(error){
    // Handle any errors that occurred during the database operations
    console.error("Error during prof request handling!!", error);
    res.status(500).json({ error: "Error during prof request handling" });
  }
};

module.exports = {
  profLogin,
  profSignUp,
  profAssignStudents,
  profGetCourse,
  profGetStudents,
  profChooseDate,
  profChooseCourse,
  profGetStudentList,
  profMarksAttendance,
  updateprofchooseDate,
  updateProfFetchStudentList,
  profUpdatesAttendance,
  profRequestReceive,
  profRequestUpdate,
};
