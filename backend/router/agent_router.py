def route_agent(agent_type: str):

    if agent_type == "engineer":
        return "engineer"

    elif agent_type == "conversational":
        return "conversational"

    elif agent_type == "research":
        return "research"

    elif agent_type == "education":
        return "education"

    elif agent_type == "automation":
        return "automation"

    raise ValueError("Invalid agent type")