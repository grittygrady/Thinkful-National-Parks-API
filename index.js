'use strict'

const apiKey = "8YjiyRefe0JQd2e9eUVGy4fAuXHl0KiCtTZibYkH";

const searchURL = "https://developer.nps.gov/api/v1/parks"

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join("&");
}

function displayResults(responseJson) {
  $("#js-error-message").empty();
  $("#results-list").empty();
  for (let i = 0; i < responseJson.data.length; i++) {
    $("#results-list").append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p><a href="${responseJson.data[i].url}" target="_blank">Official Site</a></p>
      </li>`)
  }
  $("#results").removeClass("hidden");
}

function getNationalParks(query, maxResults=10) {
  const params = {
    stateCode: query,
    limit: maxResults,
    api_key: apiKey
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  console.log(url);  //FOR TESTING, PROBABLY DELETE LATER

  fetch(url)
    .then(response => {
      if (response.ok) {
      return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if (responseJson.total === "0") {
        $("#results-list").empty();
        $("#js-error-message").text(`Something went wrong, no parks found. Double check your state abbreviations, and make sure to separate by commas.`);
      } else {
      displayResults(responseJson)}
    })
    .catch(error => alert("Something went wrong. Please try again."));
}

function formListener() {
  $("form").on('submit', function(event){
    event.preventDefault();
    const searchTerm = $('#js-state-input').val();
    const maxResults = $('#js-max-results').val();
    getNationalParks(searchTerm, maxResults);
  });
}

$(formListener);