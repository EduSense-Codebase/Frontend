'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Form, { IFormFieldBase } from '../ui_components/Form';

const Register: React.FC = () => {
  const [fname, setFname] = useState<string>('');
  const [lname, setLname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const router = useRouter();

  const fields: IFormFieldBase[] = [
    {
      type: 'text',
      placeholder: 'Enter your first name',
      value: fname,
      callbackID: '1',
      label: 'First Name',
    },
    {
      type: 'text',
      placeholder: 'Enter your last name',
      value: lname,
      callbackID: '2',
      label: 'Last Name',
    },
    {
      type: 'email',
      placeholder: 'Enter your email',
      value: email,
      callbackID: '3',
      label: 'Email',
    },
    {
      type: 'password',
      placeholder: 'Enter your password',
      value: password,
      callbackID: '4',
      label: 'Password',
    },
  ];

  const handleFieldChange = (id: string, value: string) => {
    if (id === '1') setFname(value);
    else if (id === '2') setLname(value);
    else if (id === '3') setEmail(value);
    else if (id === '4') setPassword(value);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', `${fname} ${lname}`);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('age', '10'); // Placeholder age

      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/?type=signup',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      console.log('Successfully registered');
      console.log(response.data);
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Form
        metadata={{
          heading: 'Register',
          formClassName:
            'w-full max-w-md bg-white border border-gray-300 p-8 rounded-xl shadow-sm space-y-5',
          inputGroupClassName: 'space-y-1',
        }}
        fields={fields}
        callbackFunc={handleFieldChange}
        submitCallback={handleSubmit}
        submitDisplayName="Register"
      />
    </div>
  );
};

export default Register;
