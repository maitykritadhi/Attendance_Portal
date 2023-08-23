// import logo from './logo.svg';
import './App.css';
// import Button from "react-bootstrap/Button";
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import CourseList from './components/CourseList';
import StudentList from './components/StudentList';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ChooseDay from './components/ChooseDay';
import ChooseCourse from './components/ChooseCourse';
import DisplayStudents from './components/DisplayStudents';
import UChooseDate from './components/UChooseDate';
import UChooseCourse from './components/UChooseCourse';
import UViewStudents from './components/UViewStudents';

import StudentDashboard from './components/StudentDashboard';
import CourseAttendanceDetails from './components/CourseAttendanceDetails';

function App() {
  return (
    <>
      <div className="container">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:courseId" element={<StudentList />} />
            <Route path="/chooseday" element={<ChooseDay />} />
            <Route path="/chooseday/choosecourse" element={<ChooseCourse />} />
            <Route
              path="/chooseday/choosecourse/:courseId"
              element={<DisplayStudents />}
            />
            <Route path="/uchoosedate" element={<UChooseDate />} />
            <Route
              path="/uchoosedate/uchoosecourse"
              element={<UChooseCourse />}
            />
            <Route
              path="/uchoosedate/uchoosecourse/:courseId"
              element={<UViewStudents />}
            />
            {/* <Route path="/another-route" element={<AnotherRoute />} /> */}
            <Route path="/login/studentinfo" element={<StudentDashboard />} />
            <Route
              path="/login/studentinfo/:courseId"
              element={<CourseAttendanceDetails/>}
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
