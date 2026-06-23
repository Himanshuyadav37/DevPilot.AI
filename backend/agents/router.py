def route_after_testing(state):

    iterations = state.get(
        "iterations",
        0
    )

    print("\n=== ROUTER ===")
    print("Iterations:", iterations)

    report = state.get(
        "test_results",
        ""
    ).lower()

    print("Report Preview:")
    print(report[:300])

    if iterations >= 2:
        return "end"

    bug_keywords = [
        "bug",
        "issue",
        "error",
        "security",
        "vulnerability"
    ]

    for keyword in bug_keywords:

        if keyword in report:

            print("Routing -> Debugger")

            # state["iterations"] += 1

            return "debugger"

    print("Routing -> End")

    return "end"