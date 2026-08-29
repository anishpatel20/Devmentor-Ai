import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            await login(formData);
            navigate("/dashboard");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Unable to login. Please try again.";

            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>DevMentor AI</h1>
            <h2>Login</h2>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>

            <p>
                Don't have an account?{" "}
                <Link to="/register">Create an account</Link>
            </p>
        </div>
    );
}

export default Login;