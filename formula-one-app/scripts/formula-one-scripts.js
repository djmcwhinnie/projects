// === API Endpoints ===
const baseEndpoint = 'https://ergast.com/api/f1';
const currentEndpoint = `${baseEndpoint}/current/next.json`;
const lastEndpoint = `${baseEndpoint}/current/last/results.json`;
const driverEndpoint = `${baseEndpoint}/current/driverStandings.json`;
const constructorEndpoint = `${baseEndpoint}/current/constructorStandings.json`;
const sprintEndpoint = `${baseEndpoint}/current/last/sprint.json`;
const fastestLapEndpoint = `${baseEndpoint}/current/last/fastest/1/results.json`;
const fastestPitstopEndpoint = `${baseEndpoint}/current/last/pitstops.json`;
const resultsEndpoint = `${baseEndpoint}/current/last/status.json`;
const scheduleEndpoint = `${baseEndpoint}/current.json`;

const homePage = document.querySelector('.home-page');
if (homePage) {
    // === Race Countdown ===
    // Data
    async function currentRace() {
        const response = await fetch(currentEndpoint);
        const data = await response.json();

        const currentRaceData = {
            raceName: data.MRData.RaceTable.Races[0].raceName,
            round: data.MRData.RaceTable.Races[0].round,
            season: data.MRData.RaceTable.Races[0].season,
            raceDate: data.MRData.RaceTable.Races[0].date,
            raceTime: data.MRData.RaceTable.Races[0].time,
        };

        return localStorage.setItem('currentRaceData', JSON.stringify(currentRaceData));
    }

    // Display
    function currentRaceCountdown() {
        // grab data from localStorage
        const currentRaceData = JSON.parse(localStorage.getItem('currentRaceData'));
        // countdown end date
        const raceDay = currentRaceData.raceDate;

        function getTimeRemaining(endtime) {
            const total = Date.parse(endtime) - Date.parse(new Date());
            const seconds = Math.floor((total / 1000) % 60);
            const minutes = Math.floor((total / 1000 / 60) % 60);
            const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
            const days = Math.floor(total / (1000 * 60 * 60 * 24));

            return {
                total,
                days,
                hours,
                minutes,
                seconds,
            };
        }

        function initializeClock(id, endtime) {
            const clock = document.getElementById(id);
            const daysSpan = clock.querySelector('.days');
            const hoursSpan = clock.querySelector('.hours');
            const minutesSpan = clock.querySelector('.minutes');
            const secondsSpan = clock.querySelector('.seconds');

            function updateClock() {
                const t = getTimeRemaining(endtime);
                daysSpan.innerHTML = ('0' + t.days).slice(-2);
                hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
                minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
                secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
                if (t.total <= 0) {
                    //clearInterval(timeinterval);
                    const raceDay = document.getElementById('raceDay');
                    raceDay.classList.remove('hidden');

                    const raceCountdown = document.getElementById('countdown');
                    raceCountdown.classList.add('hidden');

                    const raceNamePrefix = document.querySelector('.current-race__prefix');
                    raceNamePrefix.classList.add('hidden');
                }
            }

            updateClock(); // run function once at first to avoid delay.
            var timeinterval = setInterval(updateClock, 1000);
        }

        initializeClock('countdown', raceDay);

        // Round and race name.
        // Find the elements to populate.
        const raceRound = document.querySelector('.current-race__round');
        const raceTitle = document.querySelector('.current-race__name');

        raceRound.innerHTML = 'Round' + ' ' + currentRaceData.round;
        raceTitle.innerHTML = currentRaceData.raceName;
    }

    // Check
    function raceDayCountdown() {
        // Check if there is any data already in localStorage.
        if (!localStorage.getItem('currentRaceData')) {
            // If not run currentRace function to get it...
            function currentPromise() {
                const currentPromiseData = new Promise(function (resolve, reject) {
                    resolve(currentRace().catch(handleError));
                    reject(handleError);
                });
                return currentPromiseData;
            }

            const currentRacePromise = currentPromise();
            // ...then run the currentRaceCountdown function once the data is there.
            currentRacePromise.then(function () {
                currentRaceCountdown();
            });
        } else {
            // If the data is already in localStorage run currentCountdown function.
            currentRaceCountdown();
        }
    }

    // === Sprint Race Results ===
    // Data
    async function sprintRaceData() {
        const response = await fetch(sprintEndpoint);
        const data = await response.json();

        if (data.MRData.RaceTable.Races.length == 0) {
            // empty table, no sprint race.
            return;
        } else {
            // sprint race data available
            const sprintRaceTitle = {
                raceName: data.MRData.RaceTable.Races[0].raceName,
            };

            const sprintRaceData = [
                {
                    position: data.MRData.RaceTable.Races[0].SprintResults[0].position,
                    firstName: data.MRData.RaceTable.Races[0].SprintResults[0].Driver.givenName,
                    surname: data.MRData.RaceTable.Races[0].SprintResults[0].Driver.familyName,
                    teamName: data.MRData.RaceTable.Races[0].SprintResults[0].Constructor.name,
                    grid: data.MRData.RaceTable.Races[0].SprintResults[0].grid,
                },
                {
                    position: data.MRData.RaceTable.Races[0].SprintResults[1].position,
                    firstName: data.MRData.RaceTable.Races[0].SprintResults[1].Driver.givenName,
                    surname: data.MRData.RaceTable.Races[0].SprintResults[1].Driver.familyName,
                    teamName: data.MRData.RaceTable.Races[0].SprintResults[1].Constructor.name,
                    grid: data.MRData.RaceTable.Races[0].SprintResults[1].grid,
                },
                {
                    position: data.MRData.RaceTable.Races[0].SprintResults[2].position,
                    firstName: data.MRData.RaceTable.Races[0].SprintResults[2].Driver.givenName,
                    surname: data.MRData.RaceTable.Races[0].SprintResults[2].Driver.familyName,
                    teamName: data.MRData.RaceTable.Races[0].SprintResults[2].Constructor.name,
                    grid: data.MRData.RaceTable.Races[0].SprintResults[2].grid,
                },
            ];

            return localStorage.setItem('sprintRaceData', JSON.stringify([sprintRaceTitle, sprintRaceData]));
        }
    }

    // Display
    function sprintRaceResults() {
        // grab data from localStorage
        const sprintRaceData = JSON.parse(localStorage.getItem('sprintRaceData'));

        // create variables to find HTML elements
        const sprintRaceName = document.querySelector('.sprint-race__name');
        const sprintRaceResults = document.getElementById('sprintTable');

        // Update elements
        // check for sprint race data
        if (!localStorage.getItem('sprintRaceData')) {
            // no sprint race, hide elements
            const sprintRaceSection = document.querySelector('.sprint-race');
            sprintRaceSection.style.display = 'none';
        } else {
            sprintRaceName.innerHTML = sprintRaceData[0].raceName;

            for (var i = 0; i < sprintRaceData[1].length; i++) {
                var row = `<tr>
                <td>${sprintRaceData[1][i].position}</td>
                <td>${sprintRaceData[1][i].firstName} ${sprintRaceData[1][i].surname}</td>
                <td>${sprintRaceData[1][i].teamName}</td>
                <td>${sprintRaceData[1][i].grid}</td>
            </tr>`;
                sprintRaceResults.innerHTML += row;
            }
        }
    }

    // Check
    function sprintRaceCheck() {
        // Check localStorage for data.
        if (!localStorage.getItem('sprintRaceData')) {
            // If none, run function to get it.
            function currentPromise() {
                const currentPromiseData = new Promise(function (resolve, reject) {
                    resolve(sprintRaceData().catch(handleError));
                    reject(handleError);
                });
                return currentPromiseData;
            }

            const sprintRacePromise = currentPromise();
            // Run disaply function once the data is there.
            sprintRacePromise.then(function () {
                sprintRaceResults();
            });
        } else {
            // if the data exists, run display function.
            sprintRaceResults();
        }
    }

    // === Last Race Podiums ===
    // Data
    async function lastRace_Podium() {
        const response = await fetch(lastEndpoint);
        const data = await response.json();

        const lastRacePodiumData = {
            raceName: data.MRData.RaceTable.Races[0].raceName,
            round: data.MRData.RaceTable.Races[0].round,
            podiumFirst_Number: data.MRData.RaceTable.Races[0].Results[0].number,
            podiumFirst_Name: data.MRData.RaceTable.Races[0].Results[0].Driver.code,
            podiumSecond_Number: data.MRData.RaceTable.Races[0].Results[1].number,
            podiumSecond_Name: data.MRData.RaceTable.Races[0].Results[1].Driver.code,
            podiumThird_Number: data.MRData.RaceTable.Races[0].Results[2].number,
            podiumThird_Name: data.MRData.RaceTable.Races[0].Results[2].Driver.code,
        };

        return localStorage.setItem('lastRacePodiumData', JSON.stringify(lastRacePodiumData));
    }

    // Display
    function lastRacePodiumResults() {
        // grab data from localStorage
        const lastRacePodiumData = JSON.parse(localStorage.getItem('lastRacePodiumData'));

        // Create variables to find HTML elements
        const lastRaceName = document.querySelector('.last-race__name');
        const lastRaceRound = document.querySelector('.last-race__round');
        const posOneName = document.querySelector('.last-race__podiums__first .driver-name');
        const posOneNumber = document.querySelector('.last-race__podiums__first .driver-number');
        const posTwoName = document.querySelector('.last-race__podiums__second .driver-name');
        const posTwoNumber = document.querySelector('.last-race__podiums__second .driver-number');
        const posThreeName = document.querySelector('.last-race__podiums__third .driver-name');
        const posThreeNumber = document.querySelector('.last-race__podiums__third .driver-number');

        // Update Title
        lastRaceName.innerHTML = lastRacePodiumData.raceName;
        lastRaceRound.innerHTML = 'Round' + ' ' + lastRacePodiumData.round;

        // Update Podiums
        posOneNumber.innerHTML = lastRacePodiumData.podiumFirst_Number;
        posOneName.innerHTML = lastRacePodiumData.podiumFirst_Name;
        posTwoNumber.innerHTML = lastRacePodiumData.podiumSecond_Number;
        posTwoName.innerHTML = lastRacePodiumData.podiumSecond_Name;
        posThreeNumber.innerHTML = lastRacePodiumData.podiumThird_Number;
        posThreeName.innerHTML = lastRacePodiumData.podiumThird_Name;
    }

    // Check
    function lastRacePodiums() {
        // Check localStorage for data.
        if (!localStorage.getItem('lastRacePodiumData')) {
            // If none, run function to get it.
            function currentPromise() {
                const currentPromiseData = new Promise(function (resolve, reject) {
                    resolve(lastRace_Podium().catch(handleError));
                    reject(handleError);
                });
                return currentPromiseData;
            }

            const lastRacePodiumPromise = currentPromise();
            // Run disaply function once the data is there.
            lastRacePodiumPromise.then(function () {
                lastRacePodiumResults();
            });
        } else {
            // if the data exists, run display function.
            lastRacePodiumResults();
        }
    }

    // === Fastest Lap ===
    // Data
    async function fastestLapData() {
        const response = await fetch(fastestLapEndpoint);
        const data = await response.json();

        const fastestLapData = {
            lapTime: data.MRData.RaceTable.Races[0].Results[0].FastestLap.Time.time,
            firstName: data.MRData.RaceTable.Races[0].Results[0].Driver.givenName,
            surname: data.MRData.RaceTable.Races[0].Results[0].Driver.familyName,
            teamName: data.MRData.RaceTable.Races[0].Results[0].Constructor.name,
            lapNumber: data.MRData.RaceTable.Races[0].Results[0].FastestLap.lap,
        };

        const responseAlt = await fetch(lastEndpoint);
        const dataAlt = await responseAlt.json();

        const raceLaps = {
            lapCount: dataAlt.MRData.RaceTable.Races[0].Results[0].laps,
        };

        return localStorage.setItem('fastestLapData', JSON.stringify([fastestLapData, raceLaps]));
    }

    // Display
    function fastestLapDisplay() {
        // grab data from localStorage
        const fastestLapData = JSON.parse(localStorage.getItem('fastestLapData'));

        // Create variables to find HTML elements
        const time = document.querySelector('.fastest-lap__time');
        const driver = document.querySelector('.fastest-lap__driver');
        const team = document.querySelector('.fastest-lap__team');
        const lapNumber = document.querySelector('.lapNumber');
        const lapCount = document.querySelector('.lapCount');

        // Update page
        time.innerHTML = fastestLapData[0].lapTime;
        driver.innerHTML = fastestLapData[0].firstName + ' ' + fastestLapData[0].surname;
        team.innerHTML = fastestLapData[0].teamName;
        lapNumber.innerHTML = fastestLapData[0].lapNumber;
        lapCount.innerHTML = fastestLapData[1].lapCount;
    }

    // Check
    function fastestLapCheck() {
        // Check localStorage for data.
        if (!localStorage.getItem('fastestLapData')) {
            // If none, run function to get it.
            function currentPromise() {
                const currentPromiseData = new Promise(function (resolve, reject) {
                    resolve(fastestLapData().catch(handleError));
                    reject(handleError);
                });
                return currentPromiseData;
            }

            const fastestLapPromise = currentPromise();
            // Run disaply function once the data is there.
            fastestLapPromise.then(function () {
                fastestLapDisplay();
            });
        } else {
            // if the data exists, run display function.
            fastestLapDisplay();
        }
    }

    // === Fastest Pitstop ===
    // Data
    async function fastestPitstopData() {
        const response = await fetch(fastestPitstopEndpoint);
        const data = await response.json();

        const fastestPitstopData = {
            pitstops: data.MRData.RaceTable.Races[0].PitStops,
        };

        // sort pitstop data to find and select quickest time
        const pitstops = fastestPitstopData.pitstops.sort((a, b) => a.duration - b.duration);
        const fastestPitstop = pitstops[0];

        const fastestPitData = {
            duration: fastestPitstop.duration,
            lap: fastestPitstop.lap,
            stop: fastestPitstop.stop,
        };

        // use driverId from initial request to fetch full driver name (first name + surname)
        const driver = fastestPitstop.driverId;
        const driverUrl = `${baseEndpoint}/current/drivers/${driver}.json`;
        const driverData = await fetch(driverUrl);
        const driverInfo = await driverData.json();

        const fullDriverData = {
            firstName: driverInfo.MRData.DriverTable.Drivers[0].givenName,
            surname: driverInfo.MRData.DriverTable.Drivers[0].familyName,
        };

        // use driverId from initial request to fetch drivers constructor team name
        const teamUrl = `${baseEndpoint}/current/drivers/${driver}/constructors.json`;
        const teamData = await fetch(teamUrl);
        const teamInfo = await teamData.json();

        const constructorData = {
            teamName: teamInfo.MRData.ConstructorTable.Constructors[0].name,
        };

        return localStorage.setItem('fastestPitstopData', JSON.stringify([fastestPitData, fullDriverData, constructorData]));
    }

    // Display
    function fastestPitstopDisplay() {
        // grab data from localStorage
        const fastestPitstopData = JSON.parse(localStorage.getItem('fastestPitstopData'));

        // Create variables to find HTML elements
        const time = document.querySelector('.fastest-pitstop__time');
        const team = document.querySelector('.fastest-pitstop__team');
        const driver = document.querySelector('.fastest-pitstop__driver');
        const pitLap = document.querySelector('.pitLap');
        const stopCount = document.querySelector('.pitCount');

        // Update page
        time.innerHTML = fastestPitstopData[0].duration;
        team.innerHTML = fastestPitstopData[2].teamName;
        driver.innerHTML = fastestPitstopData[1].firstName + ' ' + fastestPitstopData[1].surname;
        pitLap.innerHTML = fastestPitstopData[0].lap;
        stopCount.innerHTML = fastestPitstopData[0].stop;
    }

    // Check
    function fastestPitstopCheck() {
        // Check localStorage for data.
        if (!localStorage.getItem('fastestPitstopData')) {
            // If none, run function to get it.
            function currentPromise() {
                const currentPromiseData = new Promise(function (resolve, reject) {
                    resolve(fastestPitstopData().catch(handleError));
                    reject(handleError);
                });
                return currentPromiseData;
            }

            const fastestPitstopPromise = currentPromise();
            // Run disaply function once the data is there.
            fastestPitstopPromise.then(function () {
                fastestPitstopDisplay();
            });
        } else {
            // if the data exists, run display function.
            fastestPitstopDisplay();
        }
    }

    // === Positions Gained ===
    // Data
    async function positionsGainedData() {
        const response = await fetch(lastEndpoint);
        const data = await response.json();

        const rawResults = data.MRData.RaceTable.Races[0].Results;

        let positionsGainedArray = [];
        for (let i = 0; i < rawResults.length; i++) {
            let posGain = Number(rawResults[i].grid) - Number(rawResults[i].position);
            if (Number(rawResults[i].grid) === 0) {
                posGain = Number(rawResults[i].position);
            } else {
                posGain = Math.max(0, posGain);
            }

            const driverData = {
                name: rawResults[i].Driver.familyName,
                team: rawResults[i].Constructor.name,
                start: rawResults[i].grid,
                finish: rawResults[i].position,
                positionsGained: posGain,
            };

            positionsGainedArray.push(driverData);
        }

        const sortPosGains = positionsGainedArray.sort((a, b) => b.positionsGained - a.positionsGained);
        const mostGains = sortPosGains[0];

        return localStorage.setItem('positionsGainedData', JSON.stringify(mostGains));
    }

    // Display
    function positionsGainedDisplay() {
        // grab data from localStorage
        const positionsGainedData = JSON.parse(localStorage.getItem('positionsGainedData'));

        // create variables to find HTML elements
        const gridPlaces = document.querySelector('.grid-climb__places__number');
        const driverName = document.querySelector('.grid-climb__places__team .team-driver');
        const teamName = document.querySelector('.grid-climb__places__team .team-constructor');
        const startPos = document.querySelector('.grid-climb__places__positions .pos-start');
        const finishPos = document.querySelector('.grid-climb__places__positions .pos-finish');

        // update elements
        gridPlaces.innerHTML = positionsGainedData.positionsGained;
        driverName.innerHTML = positionsGainedData.name;
        teamName.innerHTML = positionsGainedData.team;

        if (positionsGainedData.start == 0) {
            startPos.innerHTML = 'Pit';
        } else {
            startPos.innerHTML = positionsGainedData.start;
        }

        finishPos.innerHTML = positionsGainedData.finish;
    }

    // Check
    function positionsGainedCheck() {
        // Check localStorage for data.
        if (!localStorage.getItem('positionsGainedData')) {
            // If none, run function to get it.
            function currentPromise() {
                const currentPromiseData = new Promise(function (resolve, reject) {
                    resolve(positionsGainedData().catch(handleError));
                    reject(handleError);
                });
                return currentPromiseData;
            }

            const positionsGainedPromise = currentPromise();
            // Run display function once the data is there.
            positionsGainedPromise.then(function () {
                positionsGainedDisplay();
            });
        } else {
            // if the data exists, run display function.
            positionsGainedDisplay();
        }
    }

    // === Race Summary ===
    // Data
    async function raceSummaryData() {
        const response = await fetch(resultsEndpoint);
        const data = await response.json();

        const raceSummaryData = {
            raceSummary: data.MRData.StatusTable.Status,
        };

        return localStorage.setItem('raceSummaryData', JSON.stringify(raceSummaryData));
    }

    // Display
    function raceSummaryDisplay() {
        // grab data from localStorage
        const raceSummaryData = JSON.parse(localStorage.getItem('raceSummaryData'));

        // create variables to find HTML elements
        const raceSummaryResults = document.getElementById('raceSummaryTable');

        // Update elements
        for (var i = 0; i < raceSummaryData.raceSummary.length; i++) {
            var row = `<tr>
            <td>${raceSummaryData.raceSummary[i].status}</td>
            <td>${raceSummaryData.raceSummary[i].count}</td>
        </tr>`;
            raceSummaryResults.innerHTML += row;
        }
    }

    // Check
    function raceSummaryCheck() {
        // Check localStorage for data.
        if (!localStorage.getItem('raceSummaryData')) {
            // If none, run function to get it.
            function currentPromise() {
                const currentPromiseData = new Promise(function (resolve, reject) {
                    resolve(raceSummaryData().catch(handleError));
                    reject(handleError);
                });
                return currentPromiseData;
            }

            const raceSummaryPromise = currentPromise();
            // Run display function once the data is there.
            raceSummaryPromise.then(function () {
                raceSummaryDisplay();
            });
        } else {
            // if the data exists, run display function.
            raceSummaryDisplay();
        }
    }

    // === Driver Standings ===
    // Data
    async function driverStandingsData() {
        const response = await fetch(driverEndpoint);
        const data = await response.json();

        const driverStandingsData = [
            {
                driverPosition: data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].position,
                driverName: data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.familyName,
                driverPoints: data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].points,
                driverWins: data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].wins,
            },
            {
                driverPosition: data.MRData.StandingsTable.StandingsLists[0].DriverStandings[1].position,
                driverName: data.MRData.StandingsTable.StandingsLists[0].DriverStandings[1].Driver.familyName,
                driverPoints: data.MRData.StandingsTable.StandingsLists[0].DriverStandings[1].points,
                driverWins: data.MRData.StandingsTable.StandingsLists[0].DriverStandings[1].wins,
            },
            {
                driverPosition: data.MRData.StandingsTable.StandingsLists[0].DriverStandings[2].position,
                driverName: data.MRData.StandingsTable.StandingsLists[0].DriverStandings[2].Driver.familyName,
                driverPoints: data.MRData.StandingsTable.StandingsLists[0].DriverStandings[2].points,
                driverWins: data.MRData.StandingsTable.StandingsLists[0].DriverStandings[2].wins,
            },
        ];

        return localStorage.setItem('driverStandingsData', JSON.stringify(driverStandingsData));
    }

    // Display
    function driverStandingsDisplay() {
        // grab data from localStorage
        const driverStandingsData = JSON.parse(localStorage.getItem('driverStandingsData'));

        // create variables to find HTML elements
        const driverStandingsResults = document.getElementById('driverTable');

        // update elements
        for (var i = 0; i < driverStandingsData.length; i++) {
            var row = `<tr>
            <td>${driverStandingsData[i].driverPosition}</td>
            <td>${driverStandingsData[i].driverName}</td>
            <td>${driverStandingsData[i].driverPoints}</td>
            <td>${driverStandingsData[i].driverWins}</td>
        </tr>`;
            driverStandingsResults.innerHTML += row;
        }
    }

    // Check
    function driverStandingsCheck() {
        // Check localStorage for data.
        if (!localStorage.getItem('driverStandingsData')) {
            // If none, run function to get it.
            function currentPromise() {
                const currentPromiseData = new Promise(function (resolve, reject) {
                    resolve(driverStandingsData().catch(handleError));
                    reject(handleError);
                });
                return currentPromiseData;
            }

            const driverStandingsPromise = currentPromise();
            // Run disaply function once the data is there.
            driverStandingsPromise.then(function () {
                driverStandingsDisplay();
            });
        } else {
            // if the data exists, run display function.
            driverStandingsDisplay();
        }
    }

    // === Constructor Standings ===
    // Data
    async function constructorStandingsData() {
        const response = await fetch(constructorEndpoint);
        const data = await response.json();

        const teamStandingsData = [
            {
                teamPosition: data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0].position,
                teamName: data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0].Constructor.name,
                teamPoints: data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0].points,
                teamWins: data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0].wins,
            },
            {
                teamPosition: data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[1].position,
                teamName: data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[1].Constructor.name,
                teamPoints: data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[1].points,
                teamWins: data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[1].wins,
            },
            {
                teamPosition: data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[2].position,
                teamName: data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[2].Constructor.name,
                teamPoints: data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[2].points,
                teamWins: data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[2].wins,
            },
        ];

        return localStorage.setItem('teamStandingsData', JSON.stringify(teamStandingsData));
    }

    // Display
    function constructorStandingsDisplay() {
        // grab data from localStorage
        const teamStandingsData = JSON.parse(localStorage.getItem('teamStandingsData'));

        // set championship title year
        var championshipDate = new Date();
        document.querySelector('.champ-standings__year').innerHTML = championshipDate.getFullYear();

        // create variables to find HTML elements
        const driverStandingsResults = document.getElementById('teamTable');

        // update elements
        for (var i = 0; i < teamStandingsData.length; i++) {
            var row = `<tr>
            <td>${teamStandingsData[i].teamPosition}</td>
            <td>${teamStandingsData[i].teamName}</td>
            <td>${teamStandingsData[i].teamPoints}</td>
            <td>${teamStandingsData[i].teamWins}</td>
        </tr>`;
            driverStandingsResults.innerHTML += row;
        }
    }

    // Check
    function constructorStandingsCheck() {
        // Check localStorage for data.
        if (!localStorage.getItem('teamStandingsData')) {
            // If none, run function to get it.
            function currentPromise() {
                const currentPromiseData = new Promise(function (resolve, reject) {
                    resolve(constructorStandingsData().catch(handleError));
                    reject(handleError);
                });
                return currentPromiseData;
            }

            const constructorStandingsPromise = currentPromise();
            // Run disaply function once the data is there.
            constructorStandingsPromise.then(function () {
                constructorStandingsDisplay();
            });
        } else {
            // if the data exists, run display function.
            constructorStandingsDisplay();
        }
    }

    // === Error Handling ===
    function handleError(err) {
        console.log('Sorry, something went wrong.' + ' ' + err);
    }

    // === Clear Cache ===
    function clearCache() {
        if (localStorage.getItem('currentRaceData') !== null) {
            // grab data from localStorage with date value to compare against
            const currentRaceData = JSON.parse(localStorage.getItem('currentRaceData'));

            // get the countdown end date
            const raceDay = currentRaceData.raceDate;

            // set dates for all required days
            const today = new Date();
            const raceDayDate = new Date(raceDay);
            const clearCacheDay = new Date();

            // update date value for clearning cache
            clearCacheDay.setDate(raceDayDate.getDate() + 1);

            // clear localStorage if it's a day after a GP
            if (today >= clearCacheDay) {
                localStorage.clear();
            }
        }
    }

    // === Initialise functions ===
    clearCache();
    raceDayCountdown();
    sprintRaceCheck();
    lastRacePodiums();
    fastestLapCheck();
    fastestPitstopCheck();
    positionsGainedCheck();
    raceSummaryCheck();
    driverStandingsCheck();
    constructorStandingsCheck();
}

// === Schedule Page ===
const schedulePage = document.querySelector('.schedule-page');
if (schedulePage) {
    // === Season Schedule ===
    // Data
    async function seasonScheduleData() {
        const response = await fetch(scheduleEndpoint);
        const data = await response.json();

        let seasonScheduleData = [];
        for (let i = 0; i < data.MRData.RaceTable.Races.length; i++) {
            const roundData = {
                round: data.MRData.RaceTable.Races[i].round,
                date: data.MRData.RaceTable.Races[i].date,
                sprint: data.MRData.RaceTable.Races[i].Sprint,
                raceName: data.MRData.RaceTable.Races[i].raceName,
                trackName: data.MRData.RaceTable.Races[i].Circuit.circuitName,
            };

            seasonScheduleData.push(roundData);
        }

        return localStorage.setItem('seasonScheduleData', JSON.stringify(seasonScheduleData));
    }

    // Display
    function seasonScheduleDisplay() {
        // grab data from localStorage
        const seasonScheduleData = JSON.parse(localStorage.getItem('seasonScheduleData'));

        // loop through data and update elements
        seasonScheduleData.forEach((element) => {
            // create variables to hold data for HTML
            let roundNumber = element.round;
            let roundDate = element.date.split('-').reverse().join('/');
            let roundSprint;
            let roundName = element.raceName;
            let roundTrack = element.trackName;

            // check if there is a Sprint Race
            if (element.sprint == null) {
                roundSprint = 'No';
            } else {
                roundSprint = 'Yes';
            }

            const elementHTML = `
            <section class="round">
                <p class="round__meta">Round: <span class="round__number">${roundNumber}</span></p>
                <span class="round__meta date"><i class="fas fa-calendar-alt"></i>${roundDate}</span>
                <p class="round__meta sprint">Sprint Race: <span>${roundSprint}</span></p>
                <p class="round__name">${roundName}</p>
                <div class="round__track">
                    <img src="assets/images/race-track--two.png" alt="race track icon">
                    <p class="round__track">${roundTrack}</p>
                </div>
            </section>
            `;

            // find container element
            elementContainer = document.querySelector('.race-schedule__container');

            // append elements
            elementContainer.innerHTML += elementHTML;
        });
    }

    // Check
    function seasonScheduleCheck() {
        // Check localStorage for data.
        if (!localStorage.getItem('seasonScheduleData')) {
            // If none, run function to get it.
            function currentPromise() {
                const currentPromiseData = new Promise(function (resolve, reject) {
                    resolve(seasonScheduleData().catch(handleError));
                    reject(handleError);
                });
                return currentPromiseData;
            }

            const seasonSchedulePromise = currentPromise();
            // Run disaply function once the data is there.
            seasonSchedulePromise.then(function () {
                seasonScheduleDisplay();
            });
        } else {
            // if the data exists, run display function.
            seasonScheduleDisplay();
        }
    }

    // === Error Handling ===
    function handleError(err) {
        console.log('Sorry, something went wrong.' + ' ' + err);
    }

    // === Initialise Functions ===
    seasonScheduleCheck();
}

// === Footer Date ===
var footerDate = new Date();
document.getElementById('footer-date').innerHTML = footerDate.getFullYear();
