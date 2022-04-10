import Button from 'react-bootstrap/Button';
import React from 'react';
import Form from 'react-bootstrap/Form'
import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import app from '../../firebase.init';


const EmailPasswordForm = () => {

    const auth = getAuth(app);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');

    const [registered, setRegistered] = useState(false);
    const [name, setName] = useState();

    const handleNameBlur = e => {
        setName(e.target.value);
    }

    const handleFormSubmit = e => {
        e.preventDefault()

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }

        if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
            setError('Password Should contain at least one special character.')
            return;
        }
        setError('');
        setValidated(true);

        if (registered) {
            signInWithEmailAndPassword(auth, email, password)
                .then(result => {
                    const user = result.user;
                    console.log(user)
                })
                .catch(error => {
                    const errorMessage = error.message;
                    setError(errorMessage);
                    console.log(errorMessage)
                })
        }
        else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    //Signed In
                    const user = userCredential.user;
                    setEmail('');
                    setPassword('');
                    verifyEmail();
                    setUserName();
                    console.log(user)
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message
                    setError(errorMessage)
                    console.log(errorMessage, 'Code', errorCode)
                });
        }

    }

    const setUserName = () => {
        updateProfile(auth.currentUser, {
            displayName: name
        })
            .then(() => {
                console.log('Updating Name')
            })
            .catch(error => {
                console.log(error.message)
            })
    }

    const verifyEmail = () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log('Email verification is sent')
            })
    }

    const handlePasswordReset = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('email sent')
            })
    }

    const handleEmailBlur = e => {
        setEmail(e.target.value)
    }

    const handlePasswordBlur = e => {
        setPassword(e.target.value)
    }

    const handleRegisterChange = e => {
        setRegistered(e.target.checked)
    }


    return (
        <div className="registration w-50 mx-auto mt-5">
            <h2 className='text-primary'>Please {registered ? 'Login' : 'Register'}</h2>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                        Please Enter Your Email.
                    </Form.Control.Feedback>
                </Form.Group>

                {!registered && <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter Your Name" required />
                    <Form.Control.Feedback type="invalid">
                        Please Enter Your Name.
                    </Form.Control.Feedback>
                </Form.Group>}

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
                    <Form.Control.Feedback type="invalid">
                        Please Enter Your Password.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check onChange={handleRegisterChange} type="checkbox" label="Already Registered?" />
                </Form.Group>
                <Form.Text className="text-danger">{error}
                </Form.Text> <br />
                <Button onClick={handlePasswordReset} variant="link">Forget Password?</Button>
                <br />
                <Button variant="primary" type="submit">
                    {registered ? 'Login' : 'Register'}
                </Button>
            </Form>
        </div>
    );
};

export default EmailPasswordForm;