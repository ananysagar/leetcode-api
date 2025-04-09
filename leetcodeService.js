const fetch = require("node-fetch");

async function fetchLeetCodeData(username) {
  const query = `
    query getUserProfile($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        profile {
          reputation
          ranking
          solutionCount
          userAvatar
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
          totalSubmissionNum {
            count
          }
        }
        userCalendar {
          submissionCalendar
        }
      }
    }
  `;

  const response = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  const result = await response.json();

if (!result || !result.data) {
  console.error("Invalid response from LeetCode:", result);
  return { status: "error", message: "Invalid response from LeetCode" };
}

  const user = result.data.matchedUser;
  const questionCounts = result.data.allQuestionsCount;

  if (!user) {
    return {
      status: "error",
      message: "User not found",
    };
  }

  const acStats = user.submitStatsGlobal.acSubmissionNum;
  const totalSubmissions = user.submitStatsGlobal.totalSubmissionNum.reduce(
    (a, b) => a + b.count,
    0
  );

  const totalSolved = acStats.find((item) => item.difficulty === "All")?.count || 0;
  const acceptanceRate =
    totalSubmissions > 0
      ? ((totalSolved / totalSubmissions) * 100).toFixed(2)
      : 0;

  return {
    status: "success",
    message: "retrieved",
    totalSolved,
    totalQuestions: questionCounts.find((item) => item.difficulty === "All")?.count || 0,
    easySolved: acStats.find((item) => item.difficulty === "Easy")?.count || 0,
    totalEasy: questionCounts.find((item) => item.difficulty === "Easy")?.count || 0,
    mediumSolved: acStats.find((item) => item.difficulty === "Medium")?.count || 0,
    totalMedium: questionCounts.find((item) => item.difficulty === "Medium")?.count || 0,
    hardSolved: acStats.find((item) => item.difficulty === "Hard")?.count || 0,
    totalHard: questionCounts.find((item) => item.difficulty === "Hard")?.count || 0,
    acceptanceRate: parseFloat(acceptanceRate),
    ranking: user.profile.ranking,
    solutionCount: user.profile.solutionCount,
    reputation: user.profile.reputation,
    userAvatar: user.profile.userAvatar,
    submissionCalendar: user.userCalendar.submissionCalendar,
  };
}

module.exports = { fetchLeetCodeData };
