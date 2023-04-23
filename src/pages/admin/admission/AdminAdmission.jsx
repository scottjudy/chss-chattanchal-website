import NavBar from "../../../components/NavBar";
import styles from "../../../styles/AdminAdmission.module.css";

import { useNavigate } from "react-router-dom";

export default function AdminAdmission() {
  const navigate = useNavigate();
  return (
    <>
      <NavBar />
      <div className={styles.main}>
        <div className={styles.container}>
          <span>
            Home &gt; <span>Admission</span>
          </span>
          <div className={styles.items}>
            <div
              className={styles.item}
              onClick={() => {
                navigate("/admin/admission/new-admission");
              }}
            >
              <span>
                <img
                  src="/imgs/AdmissionImages/item1.png"
                  width="150px"
                  height="150px"
                />
              </span>
              <h1>New Admission</h1>
            </div>
            <div
              className={styles.item}
              onClick={() => {
                navigate("/admin/admission/student-details");
              }}
            >
              <span>
                <img
                  src="/imgs/AdmissionImages/item2.png"
                  width="80px"
                  height="80px"
                />
              </span>
              <h1>Student details</h1>
            </div>
            <div
              className={styles.item}
              onClick={() => {
                navigate("/admin/admission/import-students");
              }}
            >
              <span>
                <img
                  src="/imgs/AdmissionImages/item3.png"
                  width="80px"
                  height="80px"
                />
              </span>
              <h1>Import Students</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
