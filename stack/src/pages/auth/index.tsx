import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { UAParser } from "ua-parser-js";

const index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [history, setHistory] = useState<Array<{ browser: string; os: string; device: string; ip: string; time: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);

  const router = useRouter();
  const { Login, loading } = useAuth();
  const [form, setform] = useState({ email: "", password: "" });
  const handleChange = (e: any) => {
    setform({ ...form, [e.target.id]: e.target.value });
  };
  const handlesubmit = async (e: any) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("ALL Fields are required");
      return;
    }
    try {
      await Login(form);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogin = async () => {
    const parser = new UAParser();
    const result = parser.getResult();
    
    const deviceInfo = {
      browser: result.browser.name,
      os: result.os.name,
      device: result.device.type || "desktop"
    };

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
        deviceInfo
      });

      if (res.data.requireOtp) {
        setShowOtp(true);
      } else {
        alert("Login Success"); 
      }
    } catch (err) {
      
      const error = err as any;
      alert(error.response?.data?.message || "Login failed");
    }
  };  
  const verifyOtp = async () => {
    await axios.post("http://localhost:5000/api/verify-otp", {
      email,
      otp
    });

    alert("Login Successful");
    setShowOtp(false);
  };

  const fetchHistory = async () => {
    const res = await axios.get(`http://localhost:5000/api/history/${email}`);
    setHistory(res.data);
    setShowHistory(true);
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
                Log in to your account
              </CardTitle>
              <CardDescription>
                Enter your email and password to access Stack Overflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full bg-transparent text-sm"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Log in with Google
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent text-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Log in with GitHub
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={handleChange}
                  value={form.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  onChange={handleChange}
                  value={form.password}
                />
              </div>
              <Button onClick={handleLogin}
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
              >
                {loading ? "loading" : "Log in"}
              </Button>
              <Button
                onClick={fetchHistory}
                className="w-full mt-2 text-sm bg-white text-gray-600 hover:bg-white underline"
              >
                View Login History
              </Button>  
              
              <div className="text-center text-sm">
                <Link href="/forgot" className="text-blue-600 ">
                  Forgot your password?
                </Link>
              </div>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 ">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
      //otp popup
      {showOtp && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg">
            <h3 className="mb-2">Enter OTP</h3>
            <input
              className="border p-2 mb-2"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Verify
            </button>
          </div>
        </div>
      )}
      //history popup
            {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg max-h-80 overflow-y-auto">
            <h3 className="mb-2 font-bold">Login History</h3>

            {history.map((h, i) => (
              <div key={i} className="border-b py-1 text-sm">
                <p>{h.browser} | {h.os} | {h.device}</p>
                <p>{h.ip}</p>
                <p>{new Date(h.time).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default index;