
const NormalReviewResults = ({ result }) => {
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

            {/* Findings */}
            <div>
                <h3 className="text-lg font-semibold mb-4">
                    Findings
                </h3>

                {result.findings?.length > 0 ? (
                    <div className="space-y-4">
                        {result.findings.map((finding, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-gray-800 bg-gray-950 p-4"
                            >
                                {/* Severity + Category */}
                                <div className="flex flex-wrap items-center gap-2 mb-3">

                                    <span className="rounded-full bg-red-950 px-3 py-1 text-xs font-semibold text-red-300">
                                        {finding.severity}
                                    </span>

                                    <span className="rounded-full bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-300">
                                        {finding.category}
                                    </span>

                                </div>

                                {/* Location */}
                                {finding.location && (
                                    <p className="text-sm text-gray-500 mb-3">
                                        Location:{" "}
                                        <span className="text-gray-400">
                                            {finding.location}
                                        </span>
                                    </p>
                                )}

                                {/* Problem */}
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-200 mb-1">
                                        Problem
                                    </h4>

                                    <p className="text-sm text-gray-400 leading-6">
                                        {finding.problem}
                                    </p>
                                </div>

                                {/* Why It Matters */}
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-200 mb-1">
                                        Why It Matters
                                    </h4>

                                    <p className="text-sm text-gray-400 leading-6">
                                        {finding.whyItMatters}
                                    </p>
                                </div>

                                {/* Recommendation */}
                                <div>
                                    <h4 className="font-semibold text-gray-200 mb-1">
                                        Recommendation
                                    </h4>

                                    <p className="text-sm text-gray-400 leading-6">
                                        {finding.recommendation}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">
                        No significant issues were identified.
                    </p>
                )}
            </div>

            {/* Recommended Improvements */}
            <div>
                <h3 className="text-lg font-semibold mb-3">
                    Recommended Improvements
                </h3>

                {result.recommendedImprovements?.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2 text-gray-400">
                        {result.recommendedImprovements.map(
                            (improvement, index) => (
                                <li key={index}>
                                    {improvement}
                                </li>
                            )
                        )}
                    </ul>
                ) : (
                    <p className="text-gray-500">
                        No additional improvements were recommended.
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

export default NormalReviewResults;
