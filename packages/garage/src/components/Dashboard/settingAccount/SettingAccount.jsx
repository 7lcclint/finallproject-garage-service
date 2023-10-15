import { useState } from 'react';
import './settingAccount.css'
import { useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import pk from '../../../assets/images/profiles/pk.jpg'

const SettingAccount = () => {

    /* const [ firstName, setFirstName ] = useState();
    const [ lastName, setLastName ] = useState();
    const [ phone, setPhone ] = useState();
    const [ email, setEmail ] = useState();
    const [ street, setStreet ] = useState();
    const [ province, setProvince ] = useState();
    const [ district, setDistrict ] = useState();
    const [ subdistrict, setSubdistrict ] = useState();
    const [ zipcode, setZipcode ] = useState(); */
    /* const [ auth, setAuth] = useState(false); */

    const [userData, setUserData] = useState({
        user_id: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        street: '',
        province: '',
        district: '',
        subdistrict: '',
        zipcode: '',
    });

    axios.defaults.withCredentials = true;
    /* useEffect(() => {
      axios.get('http://localhost:3456/')
      .then(response => {
        console.log(response)
        if (response.data.Status === "Successfully"){
          setAuth(true);
          setUserData({
            user_id: response.data.user_id,
            firstName: response.data.firstname,
            lastName: response.data.lastname,
            phone: response.data.phone,
            email: response.data.email,
            street: response.data.address_street,
            province: response.data.address_province,
            district: response.data.address_district,
            subdistrict: response.data.address_subdistrict,
            zipcode: response.data.address_zipcode,
          });
        }else{
          setAuth(false);
          console.log(auth)
          console.log(response.data.Error)
        }
      })
      .then(error => console.log(error));
    }, []); */
    useEffect(() => {
        axios.get('http://localhost:3456/')
          .then(response => {
            console.log(response);
            if (response.data.Status === "Successfully") {
              setUserData({
                user_id: response.data.user_id,
                firstName: response.data.firstname,
                lastName: response.data.lastname,
                phone: response.data.phone,
                email: response.data.email,
                street: response.data.address_street,
                province: response.data.address_province,
                district: response.data.address_district,
                subdistrict: response.data.address_subdistrict,
                zipcode: response.data.address_zipcode,
              });
            } else {
              console.log(response.data.Error);
            }
          })
          .catch(error => console.log(error));
      }, []);

    const [ enable, setEnable ] = useState(true);
    const handleEdit = () =>{
        setEnable(!enable);
    }

    const handleSave = () => {
        axios.put('http://localhost:3456/update-user-data', userData)
        .then(response => {
            if (response.data && response.data.message) {
            console.log('User data updated successfully');
            alert('User data updated');
            setEnable(!enable);
            } else {
            console.error('Error updating user data:', response.data);
            }
        })
        .catch(error => {
            console.error('Error updating user data:', error);
        });
    };

    return (
        <>

        Setting Account
        <div className="profile">
            <div className="view">
                <div className="info">
                    <div className="topInfo">
                        <img src={pk} alt="" />
                        <button onClick={enable ? handleEdit : handleSave} className={enable ? 'edit-button-red' : 'edit-button-blue'}>
                            {enable ? 'แก้ไขข้อมูล' : 'บันทึกข้อมูล'}
                        </button>
                    </div>
                        <div className="details">
                            <Form>
                                <Row>
                                    <Col>
                                    <div>ชื่อ</div>
                                    <Form.Control
                                        style={{ backgroundColor: '#2a3447', color: 'white'}}
                                        value={userData.firstName}
                                        placeholder={userData.firstName} 
                                        disabled={enable}
                                        onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                                    />
                                    </Col>
                                    <Col>
                                    <div>นามสกุล</div>
                                    <Form.Control
                                        style={{ backgroundColor: '#2a3447', color: 'white'}}
                                        value={userData.lastName}
                                        placeholder={userData.lastName} 
                                        disabled={enable}
                                        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                                    />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div>เบอร์โทรศัพท์</div>
                                        <Form.Control 
                                            style={{ backgroundColor: '#2a3447', color: 'white'}}
                                            value={userData.phone}
                                            placeholder={userData.phone} 
                                            disabled={enable}
                                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                        />
                                    </Col>
                                    <Col>
                                        <div>อีเมล</div>
                                        <Form.Control 
                                            style={{ backgroundColor: '#2a3447', color: 'white'}}
                                            value={userData.email}
                                            placeholder={userData.email} 
                                            disabled
                                        />
                                    </Col>
                                </Row>
                                <div style={{margin: '10px 0'}}>
                                    <h2>ที่อยู่</h2>
                                </div>
                                <Row>
                                    <Col>
                                    <div>ตำบล</div>
                                    <Form.Control 
                                        style={{ backgroundColor: '#2a3447', color: 'white'}}
                                        value={userData.subdistrict}
                                        placeholder={userData.subdistrict}
                                        disabled={enable}
                                        onChange={(e) => setUserData({ ...userData, subdistrict: e.target.value })}
                                    />
                                    </Col>
                                    <Col>
                                    <div>อำเภอ</div>
                                    <Form.Control
                                        value={userData.district}
                                        style={{ backgroundColor: '#2a3447', color: 'white'}}
                                        placeholder={userData.district} 
                                        disabled={enable}
                                        onChange={(e) => setUserData({ ...userData, district: e.target.value })}
                                    />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <div>จังหวัด</div>
                                    <Form.Control
                                        value={userData.province}
                                        style={{ backgroundColor: '#2a3447', color: 'white'}}
                                        placeholder={userData.province} 
                                        disabled={enable}
                                        onChange={(e) => setUserData({ ...userData, province: e.target.value })}
                                    />
                                    </Col>
                                    <Col>
                                    <div>รหัสไปรษณีย์</div>
                                    <Form.Control
                                        style={{ backgroundColor: '#2a3447', color: 'white'}}
                                        value={userData.zipcode}
                                        placeholder={userData.zipcode} 
                                        disabled={enable}
                                        onChange={(e) => setUserData({ ...userData, zipcode: e.target.value })}
                                    />
                                    </Col>
                                </Row>
                                <Row style={{ height: '3rem' }}>
                                    <Col >
                                    <div>รายละเอียดที่อยู่</div>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Control as="textarea" rows={3} 
                                            style={{ backgroundColor: '#2a3447', color: 'white'}}
                                            value={userData.street}
                                            placeholder={userData.street} 
                                            disabled={enable}
                                            onChange={(e) => setUserData({ ...userData, street: e.target.value })}
                                        />
                                    </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
        </>
    )
}

export default SettingAccount
