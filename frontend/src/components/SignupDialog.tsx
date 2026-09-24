"use client"; 

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { signup, login } from "../api";
import { setUser } from "@/store/userSlice";
import { useDispatch } from "react-redux";

const SignupDialog = ({ trigger }: { trigger: React.ReactNode }) => {
    const [isSignup, setIsSignup] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const clearForm = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");
    };
    const [errorMessage, setErrorMessage] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        try {
            if (isSignup) {
                const userData = await signup(firstName, lastName, email, password, phoneNumber);
                dispatch(setUser(userData));
            } else {
                const userData = await login(email, password);
                dispatch(setUser(userData));
            }
            setOpen(false);
            clearForm();
        } catch (error) {
            setErrorMessage("Authentication failed. Please try again.");
            console.error("Auth error:", error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>
                        {isSignup ? "Create Account" : "Welcome Back"}
                    </DialogTitle>
                    <DialogDescription>
                        {isSignup
                            ? "Join us to start booking your travels"
                            : "Enter your credentials to access your account"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAuth} className="space-y-4 py-4">
                    {isSignup && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="w-full p-2 rounded border border-gray-500 bg-white text-black focus:border-black focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="w-full p-2 rounded border border-gray-500 bg-white text-black focus:border-black focus:outline-none"
                                />
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 rounded border border-gray-500 bg-white text-black focus:border-black focus:outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 rounded border border-gray-500 bg-white text-black focus:border-black focus:outline-none"
                        />
                    </div>
                    {isSignup && (
                        <div className="space-y-2">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                                id="phoneNumber"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                className="w-full p-2 rounded border border-gray-500 bg-white text-black focus:border-black focus:outline-none"
                            />
                        </div>
                    )}
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
                    </Button>
                </form>
                {errorMessage && (
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                )}
                <div className="text-center text-sm">
                    {isSignup ? (
                        <>
                            Already have an account?{" "}
                            <Button
                                variant="link"
                                className="p-0 text-blue-600"
                                onClick={() => setIsSignup(false)}
                            >
                                Log In
                            </Button>
                        </>
                    ) : (
                        <>
                            Don't have an account?{" "}
                            <Button
                                variant="link"
                                className="p-0 text-blue-600"
                                onClick={() => setIsSignup(true)}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SignupDialog;

