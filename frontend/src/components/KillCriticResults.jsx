const KillCriticResults = ({ result }) => {
    return (
        <div className="space-y-6">

            {/* Overall Assessment */}
            <div>
                <h3 className="text-lg font-semibold mb-2">
                    Overall Assessment
                </h3>

                <p className="text-gray-400 leading-7">
                    {result.overallAssessment}
                </p>
            </div>

            {/* Attack Surface */}
            <div>
                <h3 className="text-lg font-semibold mb-4">
                    Attack Surface
                </h3>

                {result.attackSurface?.length > 0 ? (
                    <div className="space-y-4">

                        {result.attackSurface.map(
                            (item, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-gray-800 bg-gray-950 p-4"
                                >

                                    <div className="flex flex-wrap items-center gap-2 mb-3">

                                        <span className="rounded-full bg-red-950 px-3 py-1 text-xs font-semibold text-red-300">
                                            {item.severity}
                                        </span>

                                        <span className="rounded-full bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-300">
                                            {item.category}
                                        </span>

                                    </div>

                                    {item.location && (
                                        <p className="text-sm text-gray-500 mb-3">
                                            Location:{" "}
                                            <span className="text-gray-400">
                                                {item.location}
                                            </span>
                                        </p>
                                    )}

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-200 mb-1">
                                            Weakness
                                        </h4>

                                        <p className="text-sm text-gray-400 leading-6">
                                            {item.weakness}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-200 mb-1">
                                            Attack
                                        </h4>

                                        <p className="text-sm text-gray-400 leading-6">
                                            {item.attack}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-200 mb-1">
                                            Impact
                                        </h4>

                                        <p className="text-sm text-gray-400 leading-6">
                                            {item.impact}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-200 mb-1">
                                            Defense
                                        </h4>

                                        <p className="text-sm text-gray-400 leading-6">
                                            {item.defense}
                                        </p>
                                    </div>

                                </div>
                            )
                        )}

                    </div>
                ) : (
                    <p className="text-gray-500">
                        No significant weaknesses were identified.
                    </p>
                )}
            </div>

            {/* Edge Cases */}
            <div>
                <h3 className="text-lg font-semibold mb-3">
                    Edge Cases
                </h3>

                {result.edgeCases?.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2 text-gray-400">
                        {result.edgeCases.map(
                            (edgeCase, index) => (
                                <li key={index}>
                                    {edgeCase}
                                </li>
                            )
                        )}
                    </ul>
                ) : (
                    <p className="text-gray-500">
                        No additional edge cases were identified.
                    </p>
                )}
            </div>

            {/* Interview Questions */}
            <div>
                <h3 className="text-lg font-semibold mb-3">
                    Interview Questions
                </h3>

                {result.interviewQuestions?.length > 0 ? (
                    <ol className="list-decimal pl-5 space-y-3 text-gray-400">
                        {result.interviewQuestions.map(
                            (question, index) => (
                                <li key={index}>
                                    {question}
                                </li>
                            )
                        )}
                    </ol>
                ) : (
                    <p className="text-gray-500">
                        No interview questions were generated.
                    </p>
                )}
            </div>

            {/* Final Verdict */}
            <div>
                <h3 className="text-lg font-semibold mb-2">
                    Final Verdict
                </h3>

                <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                    <p className="text-gray-400 leading-7">
                        {result.finalVerdict}
                    </p>
                </div>
            </div>

        </div>
    );
};

export default KillCriticResults;