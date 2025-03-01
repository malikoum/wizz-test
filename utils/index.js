function fetchAndAggregateGames() {
  return new Promise((resolve, reject) => {
    const promisesArray = [
      fetch(
        "https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json"
      )
        .then((response) => response.json())
        .catch((err) => {
          console.log("There was an error querying games", JSON.stringify(err));
          return reject(err);
        }),
      fetch(
        "https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json"
      )
        .then((response) => response.json())
        .catch((err) => {
          console.log("There was an error querying games", JSON.stringify(err));
          return reject(err);
        }),
    ];
    Promise.all(promisesArray)
      .then((results) => {
        const androidGames = results[0].map((game) => ({
          publisherId: game[0].publisher_id,
          name: game[0].name,
          platform: "android",
          storeId: game[0].id,
          bundleId: game[0].bundle_id,
          appVersion: game[0].version,
          isPublished: true,
        }));
        const iosGames = results[1].map((game) => ({
          publisherId: game[0].publisher_id,
          name: game[0].name,
          platform: "ios",
          storeId: game[0].id,
          bundleId: game[0].bundle_id,
          appVersion: game[0].version,
          isPublished: true,
        }));

        const games = [...androidGames, ...iosGames];
        resolve(games);
      })
      .catch((err) => {
        console.log("There was an error querying games", JSON.stringify(err));
        return reject(err);
      });
  });
}

module.exports = { fetchAndAggregateGames };
