import {Link, useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios"
import { getUserID } from "../hooks/getUserID";
import View from "./View";

export const Home = () => {

    const [cookies,setCookies] = useCookies(["access_token"])
    const navigate = useNavigate()

    const [add,setAdd] = useState(false)
    const [edit,setEdit] = useState(false)
    const [contacts,setContacts] = useState([])
    const [updatedID,setUpdatedID] = useState("")

    const userID = getUserID()

    const [contact,setContact] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        user_id: userID
    })

    const logout = () => {
        setCookies("access_token","")
        window.localStorage.removeItem("userID")
        navigate("/auth")
    }

    const handleChange = (event) => {
        const {name,value} = event.target
        setContact({...contact, [name]:value})
    }

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/contacts/${userID}`)
                setContacts(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchContacts()
    }, [])

    const addContact = async (e) => {
        e.preventDefault()
        try {
            await axios.post("http://localhost:8000/contacts",contact)
            setContacts(prev => [...prev,contact])
            alert("Contact created!")
            setContact({
                first_name: "",
                last_name: "",
                phone: "",
                user_id: userID
            })
            setAdd(false)
        } catch (error) {
            console.error(error)
        }
    }

    const updateContact = async (e) => {
        e.preventDefault()
        try {
            const updatedName = contact.first_name
            const updatedSurname = contact.last_name
            const updatedNumber = contact.phone
            console.log(updatedName,updatedNumber)
            await axios.put(`http://localhost:8000/contacts/update/${updatedID}`,{updatedName,updatedSurname,updatedNumber})
            alert("Contact updated!")
            setEdit(false)
            const updatedContactIndex = contacts.findIndex(item => item.contact_id === updatedID)
            contacts[updatedContactIndex].first_name = updatedName
            contacts[updatedContactIndex].last_name = updatedSurname
            contacts[updatedContactIndex].phone = updatedNumber
        } catch (error) {
            console.error(error)
        }

    }

    const deleteContact = async (id) => {
        try{
            const res = await axios.delete(`http://localhost:8000/contacts/delete/${id}`)
            const newContacts = contacts.filter(item=> item.contact_id !== id);
            setContacts(newContacts);
          }catch(err){
            console.log(err);
          }
    }

    const editContact = (id) => {
        edit ? setEdit(false) : setEdit(true)
        add ? setAdd(false) : setAdd(add)

        console.log(id)
        
        setUpdatedID(id)

        for (let index = 0; index < contacts.length; index++) {
            if(contacts[index].contact_id === id) {
                setContact({
                    first_name:contacts[index].first_name,
                    last_name:contacts[index].last_name,
                    phone:contacts[index].phone,
                    user_id:userID
                })
            }
            
        }

    }

    const handleAdd = () => {      
        if(add) {
            setAdd(false)
        }
        else{
            setAdd(true)
        }
        if(edit) {
            setEdit(false)
        }

    }

    const handleAddEdit = () => {
        if(edit) {
            edit ? setEdit(false) : setEdit(true)
            if(add) setAdd(false);
        }
        if(add) {
            add ? setAdd(false) : setAdd(true)
            if(edit) setEdit(false);
        }
        setContact({
            first_name: "",
            last_name: "",
            phone: "",
            user_id: userID
        })
    }

    return (

        <div className="home" >
            <div className="home-content">

                {!cookies.access_token ? <Link to="/auth" >Login/Register</Link> : <button className="logout" onClick={logout}>Logout</button>}
                <br/>
                <h1>{localStorage.getItem("username")}'s Contacts</h1>
                <button className="add-contact" onClick={handleAdd}>Add Contact</button>

                {add && 
                    <div>
                        <div onClick={handleAddEdit} className="overlay"></div>
                            <div className="wrapper">
                                <div className="main">
                                    <div className="form-container">
                                        <form className="form-group" autoComplete="off" onSubmit={addContact}>
                                            <label>Name</label>
                                            <input type="text" className="form-control" name="first_name" required onChange={handleChange}
                                            />
                                            <br />
                                            <label>Surname</label>
                                            <input type="text" className="form-control" name="last_name" required onChange={handleChange}
                                            />
                                            <br />
                                            <label>Number</label>
                                            <input type="text" className="form-control" name="phone" required onChange={handleChange}
                                            />
                                            <br />
                                            <button type="submit" className="btn btn-success btn-md">ADD</button>
                                            <button onClick={handleAdd} className="close-btn">CLOSE</button>
                                        </form>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {edit && 
                    <div>
                        <div onClick={handleAddEdit} className="overlay"></div>
                            <div className="wrapper">
                                <div className="main">
                                    <div className="form-container">
                                        <form className="form-group" autoComplete="off" onSubmit={(e) => {updateContact(e)}}>
                                            <label>Name</label>
                                            <input type="text" id="name-text" className="form-control" name="first_name" required 
                                            value={contact.first_name} onChange={handleChange} />
                                            <br />
                                            <label>Surname</label>
                                            <input type="text" id="surname-text" className="form-control" name="last_name" required 
                                            value={contact.last_name} onChange={handleChange}/>
                                            <br />
                                            <label>Number</label>
                                            <input type="text" className="form-control" name="phone" required 
                                            value={contact.phone} onChange={handleChange}/>
                                            <br />
                                            <button type="submit" id="save-btn" className="btn btn-success btn-md">SAVE</button>
                                            <button onClick={handleAddEdit} className="close-btn">CLOSE</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                }

                <div className="view-container">
                    {<>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th id="table-th">Id</th>
                                        <th id="table-th">Name</th>
                                        <th id="table-th">Lastname</th>
                                        <th id="table-th">Number</th>
                                        <th id="table-th">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <View contacts={contacts} editContact={editContact} deleteContact={deleteContact}/>
                                </tbody>
                            </table>
                        </div>
                    </>}
                    {}  
                </div>

            </div>
        </div>
    )
}