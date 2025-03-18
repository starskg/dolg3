import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    avatar_url: ""
  });
  // Tanlangan faylni saqlash uchun state
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  const avatarPath = user.avatar_url.startsWith('/')
    ? user.avatar_url
    : '/' + user.avatar_url;

  // Foydalanuvchi maʼlumotlarini olish
  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, [setIsAuthenticated]);

  // Profilni yangilash (FormData bilan)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("mobile", user.mobile);
    formData.append("address", user.address);
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/profile/update",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(res.data.message);
      // Получаем обновлённые данные пользователя
      const updatedUser = await axios.get("http://localhost:5000/auth/user", { withCredentials: true });
      setUser(updatedUser.data);
      setEditMode(false);
    } catch (error) {
      setError(error.response?.data?.message || "Ошибка обновления профиля");
    }
  };

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
              <MDBBreadcrumbItem>
                <a href="/dashboard">Home</a>
              </MDBBreadcrumbItem>
              <MDBBreadcrumbItem>
                <a href="/profile">User</a>
              </MDBBreadcrumbItem>
              <MDBBreadcrumbItem active>Профиль пользователя</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          {/* Chap kolonka: profil rasmi va qisqacha ma'lumot */}
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={`http://localhost:5000${avatarPath}?v=${new Date().getTime()}`}
                  alt="avatar"
                  className="rounded-circle"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover'
                  }}
                />
                <p className="text-muted mb-1">{user.name || "Full Stack Developer"}</p>
                <p className="text-muted mb-4">{user.address || "Bay Area, San Francisco, CA"}</p>
                <div className="d-flex justify-content-center mb-2">

                </div>
              </MDBCardBody>
            </MDBCard>


          </MDBCol>

          {/* O'ng kolonka: dastlabki "Обзор" (read-only) yoki "Редактирование" formasi */}
          <MDBCol lg="8">
            {editMode ? (
              // Tahrirlash formasi
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <h3 className="text-center mb-3">Редактировать профиль</h3>
                  {message && <Alert variant="success" className="text-center">{message}</Alert>}
                  {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                  <Form onSubmit={handleUpdate}>
                    <Form.Group className="mb-3">
                      <Form.Label>Имя</Form.Label>
                      <Form.Control
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Телефон</Form.Label>
                      <Form.Control
                        type="text"
                        value={user.mobile}
                        onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Адрес</Form.Label>
                      <Form.Control
                        type="text"
                        value={user.address}
                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Аватар</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                      Сохранить
                    </Button>
                    <Button variant="secondary" onClick={() => setEditMode(false)} className="w-100 mt-2">
                      Отменить
                    </Button>
                  </Form>
                </MDBCardBody>
              </MDBCard>
            ) : (
              // Обзор (read-only) rejimi
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <h3 className="text-center mb-3">Профиль</h3>
                  <MDBRow className="mb-2">
                    <MDBCol sm="3">
                      <MDBCardText>Имя</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{user.name}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow className="mb-2">
                    <MDBCol sm="3">
                      <MDBCardText>Email</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{user.email}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow className="mb-2">
                    <MDBCol sm="3">
                      <MDBCardText>Мобил</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{user.mobile}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow className="mb-2">
                    <MDBCol sm="3">
                      <MDBCardText>Адрес</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{user.address}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <div className="text-center mt-3">
                    <Button variant="primary" onClick={() => setEditMode(true)}>
                      Изменить
                    </Button>
                  </div>
                </MDBCardBody>
              </MDBCard>
            )}


          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
export default Profile;
