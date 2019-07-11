'use strict';

const rp = require('request-promise');
const {sendEmail} = require('./mailer');
require('dotenv').config();

// const boardId = 'R9dmoDTl';

const makeRequest = function(url, qs = {}) {
  return rp({
    method: 'GET',
    url: 'https://api.trello.com/' + url,
    qs: Object.assign({
      key: process.env.TRELLO_ACCESS_KEY,
      token: process.env.TRELLO_ACCESS_TOKEN,
      cards: 'none',
      fields: 'id,name',
      card_fields: 'false',
    }, qs),
  });
};

const getCardsByType = (cards, type) => cards.filter(
  card => card.labels.find(l => l.name.toLowerCase() === type),
);

const getMemberPosition = (members, fullName) =>
  members.map(e => e.fullName).indexOf(fullName);

const getCardsByTypeByMember = (members, cards, type) => {

  cards.forEach(function(card) {
    card.members.forEach(function(member) {
      let pos = getMemberPosition(members, member.fullName);
      if (pos === -1) {
        pos = members.push({fullName: member.fullName}) - 1;
      }
      if (!members[pos][type]) {
        members[pos][type] = [];
      }
      let pts = card.labels.find(label =>
        label.name.toLowerCase().includes('pts'));
      pts = pts ? parseInt(pts.name.replace('pts', ''), 10) : 0;
      members[pos][type].push({name: card.name, pts});
    });
  });

  return members;
};

const htmlSection = (name, cards) => {
  let html = '<h4 style="margin-bottom: 0">' + name + '</h4>';
  html += '<ul style="padding-left: 15px; font-size: 13px;">';
  let totalPts = 0;
  cards.forEach(function(card) {
    html += '<li>' + card.name;
    if (card.pts > 0) {
      html += ', <b>' + card.pts + '</b> pts';
    }
    html += ' </li>';
    totalPts += card.pts;
  });
  html += '</ul>';
  if (totalPts > 0) html += '<b>Total puntos: ' + totalPts + ' </b>';
  return html;
};

let generateReport = (boardId, reportName, shouldSendEmail = false) => {
  return makeRequest('1/boards/' + boardId + '/lists').then(res => {
    const lists = JSON.parse(res);
    return lists.find(x => x.name.toLowerCase() === 'done');
  }).then(doneList => {
    return makeRequest('1/lists/' + doneList.id + '/cards', {
      fields: 'id,name,labels',
      members: true,
      labels: 'all',
      member_fields: 'fullName',
      label_fields: 'name',
    });
  }).then(res => {

    const cards = JSON.parse(res);
    let members = [];

    getCardsByTypeByMember(members,
      getCardsByType(cards, 'user story'), 'stories');
    getCardsByTypeByMember(members,
      getCardsByType(cards, 'minor bug'), 'minorbugs');
    getCardsByTypeByMember(members,
      getCardsByType(cards, 'trivial bug'), 'trivialbugs');
    getCardsByTypeByMember(members,
      getCardsByType(cards, 'major bug'), 'majorbugs');
    getCardsByTypeByMember(members,
      getCardsByType(cards, 'critical bug'), 'criticalbugs');
    getCardsByTypeByMember(members,
      getCardsByType(cards, 'spike'), 'spikes');

    let html = '';

    members.forEach(function(member) {
      html += '<h3 style="color:#2196F3">' + member.fullName + '</h3>';

      if (member['stories']) {
        html += htmlSection('User Stories', member['stories']);
      }
      if (member['trivialbugs']) {
        html += htmlSection('Trivial Bugs', member['trivialbugs']);
      }
      if (member['minorbugs']) {
        html += htmlSection('Minor Bugs', member['minorbugs']);
      }
      if (member['majorbugs']) {
        html += htmlSection('Major Bugs', member['majorbugs']);
      }
      if (member['criticalbugs']) {
        html += htmlSection('Critical Bugs', member['criticalbugs']);
      }
      if (member['spikes']) {
        html += htmlSection('Spikes', member['spikes']);
      }
    });

    // console.log(html);
    console.dir(members, {depth: null, colors: true});
    if (shouldSendEmail) sendEmail(html, reportName);
  });
};

module.exports = generateReport;
