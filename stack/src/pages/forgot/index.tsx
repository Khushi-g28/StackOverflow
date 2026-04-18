import React, { useState } from 'react'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {toast} from "react-toastify";
import Router from 'next/router';
import { CardDescription , CardTitle, CardHeader ,Card , CardContent} from '@/components/ui/card';
import { Label } from "@/components/ui/label";

const index = () =>{
    const[email,setEmail] = useState("");
    const[phone,setPhone] = useState("");
    const[message,setMessage] = useState("");
    
    const [form, setform] = useState({ name: "", email: "", password: "" });
  const handleChange = (e: any) => {
    setform({ ...form, [e.target.id]: e.target.value });
  };
    const handlesubmit = async (e: any) =>{
      e.preventDefault();
      if (!form.name || !form.email || !form.password) {
            toast.error("ALL Fields are required");
            return;
          }

      const res = await fetch("http://localhost:5000/api/auth/forgotpassword",{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body:JSON.stringify({ email, phone })
      });
      const data = await res.json();
      setMessage(data.message + (data.newpassword ? ` Your new password is: ${data.newpassword}` : "" ));
    };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 lg:mb-8">
          <Link href="/" className="flex items-center justify-center mb-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-orange-500 rounded mr-2 flex items-center justify-center">
              <div className="w-4 h-4 lg:w-6 lg:h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 lg:w-4 lg:h-4 bg-orange-500 rounded-sm"></div>
              </div>
            </div>
            <span className="text-lg lg:text-xl font-bold text-gray-800">
              stack<span className="font-normal">overflow</span>
            </span>
          </Link>
        </div>
        <form onSubmit={handlesubmit}>
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-xl lg:text-2xl">
                Forgot your password?
              </CardTitle>
              <CardDescription>
                Enter your email or phone number and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
                

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  
                  Email or Phone Number
                </Label>
                <Input
                  id="email"
                  type="email or phone"
                  placeholder="m@example.com"
                 onChange={(e) => {setEmail(e.target.value);
                  setPhone(e.target.value);}}
                />
              </div>
              <div className="password space-y-2">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New Password"
                  onChange={handleChange}
                 value={form.password}
                />
              </div>
              <div className="text-sm text-brown-500">
                You can use this option only one time per day.
              </div>
              <Button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
              >
                 Reset Password
              </Button>
              
              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/auth" className="text-blue-600 hover:underline">
                  log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
}


export default index