import { useState } from 'react';
import './settingAccount.css'
import { useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import pk from '../../../assets/images/profiles/pk.jpg'

const SettingAccount = () => {

    /* const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('http://localhost:3456/upload', {
            method: 'POST',
            body: formData,
            });

            if (response.ok) {
            console.log('File uploaded successfully.');
            const data = await response.json(); // Parse the response JSON
            const imagePath = data.imagePath;
            console.log('File uploaded successfully. Image path:', imagePath);
            } else {
            console.error('File upload failed.');
            }
        } catch (error) {
            console.error('File upload failed:', error);
        }
        }
    }; */
           {/*  <div>
            <h2>Setting Account</h2>
            <div className="container">
                <div className="row">
                <div className="col-xs-6 col-md-4">
                    {selectedFile ? (
                    <img src={URL.createObjectURL(selectedFile)} className="rounded-circle" alt="User Avatar" />
                    ) : (
                    <img src="/noavatar.png" className="rounded-circle" alt="User Avatar" />
                    )}
                </div>
                </div>
            </div>
            <div className="settingAccount-container">
                <form>
                <div className="form-group">
                    <label htmlFor="image">Upload Image</label>
                    <input type="file" id="image" accept="image/*" onChange={handleFileChange} />
                </div>
                <button type="button" onClick={handleUpload}>
                    Upload Image
                </button>
                </form>
            </div>
        </div> */}

    const [ firstName, setFirstName ] = useState();
    const [ lastName, setLastName ] = useState();
    const [ phone, setPhone ] = useState();
    const [ email, setEmail ] = useState();
    //const [ profile, setProfile ] = useState();
    const [ street, setStreet ] = useState();
    const [ province, setProvince ] = useState();
    const [ district, setDistrict ] = useState();
    const [ subdistrict, setSubdistrict ] = useState();
    const [ zipcode, setZipcode ] = useState();
    const [ auth, setAuth] = useState(false);

    axios.defaults.withCredentials = true;
    useEffect(() => {
      axios.get('http://localhost:3456/')
      .then(response => {
        console.log(response)
        if (response.data.Status === "Successfully"){
          setAuth(true);
          window.localStorage.setItem('isLoggedIn', true);
          setFirstName(response.data.firstname);
          setLastName(response.data.lastname);
          setPhone(response.data.phone);
          setEmail(response.data.email);
          setStreet(response.data.address_street);
          setProvince(response.data.address_province);
          setDistrict(response.data.address_district);
          setSubdistrict(response.data.address_subdistrict);
          setZipcode(response.data.address_zipcode);
          console.log(response.data);
        }else{
          setAuth(false);
          console.log(auth)
          console.log(response.data.Error)
        }
      })
      .then(error => console.log(error));
    }, [auth]);

    const [ enable, setEnable ] = useState(true);
    const handleEdit = () =>{
        setEnable(!enable);
    }

/*     const handleSave = () => {
        // Prepare the data for update
        const updatedUserData = {
          firstName,
          lastName,
          phone,
          email,
          street,
          province,
          district,
          subdistrict,
          zipcode,
        };
    
        axios.put('http://localhost:3456/updateUser', updatedUserData)
          .then((response) => {
            if (response.data.message === 'User data updated successfully') {
              console.log('User data updated successfully');
            }
          })
          .catch((error) => {
            console.error('Error updating user data:', error);
        });
    }; */

    return (
        <>

        Setting Account
        <div className="profile">
            <div className="view">
                <div className="info">
                    <div className="topInfo">
                        <img src={pk} alt="" />
                        <button onClick={handleEdit} className={enable ? 'edit-button-red' : 'edit-button-blue'}>
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
                                        value={firstName}
                                        placeholder={firstName} 
                                        disabled={enable}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    </Col>
                                    <Col>
                                    <div>สกุล</div>
                                    <Form.Control
                                        style={{ backgroundColor: '#2a3447', color: 'white'}}
                                        value={lastName}
                                        placeholder={lastName} 
                                        disabled={enable}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div>เบอร์โทรศัพท์</div>
                                        <Form.Control 
                                            style={{ backgroundColor: '#2a3447', color: 'white'}}
                                            value={phone}
                                            placeholder={phone} 
                                            disabled={enable}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </Col>
                                    <Col>
                                        <div>อีเมล</div>
                                        <Form.Control 
                                            style={{ backgroundColor: '#2a3447', color: 'white'}}
                                            value={email}
                                            placeholder={email} 
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
                                        value={subdistrict}
                                        placeholder={subdistrict}
                                        disabled={enable}
                                        onChange={(e) => setSubdistrict(e.target.value)}
                                    />
                                    </Col>
                                    <Col>
                                    <div>อำเภอ</div>
                                    <Form.Control
                                        value={district}
                                        style={{ backgroundColor: '#2a3447', color: 'white'}}
                                        placeholder={district} 
                                        disabled={enable}
                                        onChange={(e) => setDistrict(e.target.value)}
                                    />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <div>จังหวัด</div>
                                    <Form.Control
                                        value={province}
                                        style={{ backgroundColor: '#2a3447', color: 'white'}}
                                        placeholder={province} 
                                        disabled={enable}
                                        onChange={(e) => setProvince(e.target.value)}
                                    />
                                    </Col>
                                    <Col>
                                    <div>รหัสไปรษณีย์</div>
                                    <Form.Control
                                        style={{ backgroundColor: '#2a3447', color: 'white'}}
                                        value={zipcode}
                                        placeholder={zipcode} 
                                        disabled={enable}
                                        onChange={(e) => setZipcode(e.target.value)}
                                    />
                                    </Col>
                                </Row>
                                <Row style={{ height: '3rem' }}>
                                    <Col >
                                    <div>รายละเอียดที่อยู่</div>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Control as="textarea" rows={3} 
                                            style={{ backgroundColor: '#2a3447', color: 'white'}}
                                            value={street}
                                            placeholder={street} 
                                            disabled={enable}
                                            onChange={(e) => setStreet(e.target.value)}
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
