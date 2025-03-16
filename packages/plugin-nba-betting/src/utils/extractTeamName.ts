const teamNameMap: { [key: string]: string } = {
    Hawks: "Atlanta Hawks",
    Celtics: "BOS Celtics",
    Nets: "Brooklyn Nets",
    Hornets: "Charlotte Hornets",
    Bulls: "CHI Bulls",
    Cavaliers: "Cleveland Cavaliers",
    Mavericks: "Dallas Mavericks",
    Nuggets: "Denver Nuggets",
    Pistons: "Detroit Pistons",
    Warriors: "Golden State Warriors",
    Rockets: "Houston Rockets",
    Pacers: "Indiana Pacers",
    Clippers: "LA Clippers",
    Lakers: "LAL Lakers",
    Grizzlies: "Memphis Grizzlies",
    Heat: "Miami Heat",
    Bucks: "MIL Bucks",
    Timberwolves: "Minnesota Timberwolves",
    Pelicans: "New Orleans Pelicans",
    Knicks: "New York Knicks",
    Thunder: "Oklahoma City Thunder",
    Magic: "Orlando Magic",
    ["76ers"]: "Philadelphia 76ers",
    Suns: "Phoenix Suns",
    TrailBlazers: "Portland Trail Blazers",
    Kings: "Sacramento Kings",
    Spurs: "San Antonio Spurs",
    Raptors: "Toronto Raptors",
    Jazz: "Utah Jazz",
    Wizards: "Washington Wizards",
};

const TeamNames = Object.keys(teamNameMap);

const FullTeamNames = Object.values(teamNameMap);

export const extractTeamName = (text: string) => {
    const event = TeamNames.find((event) =>
        text.toLocaleLowerCase().includes(event.toLocaleLowerCase())
    );
    if (!!event) {
        return teamNameMap[event];
    }
    return FullTeamNames.find((event) =>
        text.toLocaleLowerCase().includes(event.toLocaleLowerCase())
    );
};
