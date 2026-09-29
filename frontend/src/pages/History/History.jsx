import { useEffect, useState } from "react";

import { getHistory } from "../../api/axios";
import "./History.css";

const History = () => {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const response = await getHistory();
                setHistory(response.data || []);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load request history.");
            }
        };

        loadHistory();
    }, []);

    return (
        <div className="history-page">
            <h1 className="generate-title">Request History</h1>
            <p className="generate-description">Your latest generation and analysis requests.</p>
            {error && <p className="history-error">{error}</p>}
            {!error && history.length === 0 && <p className="history-empty">No requests yet.</p>}
            {history.length > 0 && (
                <div className="history-table-wrapper">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Language</th>
                                <th>Model</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.taskType}</td>
                                    <td>{request.language}</td>
                                    <td>{request.routedModel || "Unavailable"}</td>
                                    <td>{new Date(request.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default History;
