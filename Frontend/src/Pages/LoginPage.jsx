import React from 'react';

const LoginPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-light">
            <div className="w-full max-w-md bg-lighter p-8 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-semibold text-primary mb-6">
                    FortiChat Login
                </h2>
                <form>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-secondary font-medium mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-secondary font-medium mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-secondary transition duration-200"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-sm text-secondary mt-4">
                    Don't have an account?{' '}
                    <a
                        href="/register"
                        className="text-primary hover:underline font-medium"
                    >
                        Register here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
