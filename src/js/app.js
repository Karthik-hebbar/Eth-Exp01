//get account
function getAccount() {
  return new Promise((resolve, reject) => {
    web3.eth.getCoinbase(async function (err, account) {
      if (err) {
        return reject(err);
      }

      //<Display image for each account>

      try {
        const UserDisplay = await $.getJSON("Display.json");
        // Instantiate a new truffle contract from the artifact
        App.contracts.User = TruffleContract(UserDisplay);
        // Connect provider to interact with contract
        App.contracts.User.setProvider(App.web3Provider);
        // Get the contract instance
        App.contract1 = await App.contracts.User.deployed();

        App.contracts.User.deployed().then((instance) => {
          instance1 = instance;

          instance1.usercount().then((count) => {
            for (let i = 1; i <= count; i++) {
              instance.Users(i).then((user) => {
                var address = user[1];
                var pic = user[2];

                if (address == account) {
                  $("#dp").attr("src", pic);
                }
              });
            }
          });
        });
      } catch (e) {
        console.log(e);
      }

      // </Dp for each account>

      console.log("Account is:" + App.account);

      $("#accountAddress").html("Your Account: " + account);
      return resolve(account);
    });
  });
}
// Block list panel
function openNav() {
  document.getElementById("mySidenav").style.width = "610px";
  document.getElementById("main").style.marginLeft = "710px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "29%";
}
// block list timestamp conversion
async function viewDate(x) {
  c = document.getElementsByClassName("time");
  var length = c.length;

  var time12 = [];
  for (let i = 0; i < length - 1; i++) {
    if (c[i] == x) {
      await getBLocklist(i + 1).then((data) => {
        var times = new Date(data.timestamp * 1000);

        time12[i] = times;

        x.innerHTML = time12[i];
      });
      break;
    }
  }
}
// block list time/Date conversion
async function viewTimestamp(x) {
  c = document.getElementsByClassName("time");
  var length = c.length;
  var time12 = [];

  for (let i = 0; i < length - 1; i++) {
    if (c[i] == x) {
      await getBLocklist(i + 1).then((data) => {
        var times = data.timestamp;

        time12[i] = times;

        x.innerHTML = time12[i];
      });
      break;
    }
  }
}
//blocklist
function getBLocklist(i) {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock(i, function (err, list) {
      if (err) {
        return reject(err);
      }

      return resolve(list);
    });
  });
}

//get current number of blocks
function getblockno() {
  return new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((err, blockc) => {
      if (err) {
        return reject(err);
      }

      return resolve(blockc);
    });
  });
}

App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",
  contract: null,
  hasVoted: false,
  blocks: null,
  contract1: null,

  init: function () {
    return App.initWeb3();
  },
  init: async function () {
    return await App.initWeb3();
  },

  initWeb3: async function () {
    if (typeof web3 !== "undefined") {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
      web3 = new Web3(App.web3Provider);
    }

    // for latest web browser
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }

    return await App.initContract();
  },
  initContract: async function () {
    try {
      const elect = await $.getJSON("Election.json");
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(elect);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      // Get the contract instance
      App.contract = await App.contracts.Election.deployed();
      // Get current account provided by Metamask
      App.account = await getAccount();
      //get total number of blocks
      App.blocks = await getblockno();
      $("#Blockcount").html("Blocks: " + App.blocks);

      return App.render();
    } catch (e) {
      console.log(e);
    }
  },
  render: async function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    var v = [];
    var c;

    var count = await App.contract.voterc();

    var candicount = await App.contract.candidatesCount();
    var votelimit = 6;

    if (count == votelimit) {
      App.contracts.Election.deployed().then(function (instance) {
        Elec = instance;

        Elec.candidatesCount().then((count1) => {
          for (let i = 1; i <= count1; i++) {
            Elec.candidates(i).then((candi) => {
              c = Number(candi[3]);
              v[i] = c;
              console.log(v[i]);

              if (v.length >= 3) {
                cal(...v);
              }
            });
          }
        });
      });
    }

    function cal(a, x, y, z) {
      var k = [];

      k[0] = x;
      k[1] = y;
      k[2] = z;

      var max4 = Math.max(...k);
      var j = 0;

      for (let i = 0; i < k.length; i++) {
        if (max4 == k[i]) {
          j++;
        }
      }
      //if there is a tie
      if (j >= 2) {
        var l = [];
        // to set l's index value
        var q = 0;

        for (let i = 1; i <= candicount; i++) {
          Elec.candidates(i).then((candidate) => {
            var name = candidate[1];
            var vote1 = candidate[3];
            if (max4 == vote1) {
              l[q] = name;
              q++;
            }

            if (i == 3) {
              //if there is a tie between all candidates
              if (l.length == 3) {
                draw1(candicount);
              } else if (l.length > 1) {
                draw2(...l);
              }
            }
          });
        }
      } else {
        var Result = $(".container1");
        for (let k = 1; k <= candicount; k++) {
          Elec.candidates(k).then((candidates1) => {
            var name = candidates1[1];
            var winnerimage = candidates1[2];
            var votecc = candidates1[3];

            var final = (votecc / votelimit) * 100 + "%";

            if (max4 == votecc) {
              $(".container1").show();
              $("#winner").show();
              $("form").hide();
              $("#result").html("The Winner is " + name);

              // $("#p1").html(name);

              // $("#p1").width(final);
            }
            // if (max4 > votecc) {
            //   var template =
            //     "<div class='progress'> <div class='progress-bar progress-bar-success' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width:" +
            //     final +
            //     "'>" +
            //     name +
            //     "</div></div>";

            //   Result.append(template);
            // }
          });
        }
      }
    }

    function draw1(candicount) {
      console.log();
      $("#result").html("Tie between all " + candicount);
      $("form").hide();
    }
    function draw2(x, y) {
      $("#result").html("There's been a tie between " + x + " and " + y);
      $("form").hide();
    }

    //render block list
    var number = [];
    var hash = [];
    var parenthash = [];
    var timestamp = [];
    var time = [];
    var transcation = [];
    var temp = App.blocks;
    for (let i = 0; i < App.blocks; i++) {
      await getBLocklist(i + 1).then((data) => {
        number[i] = data.number;
        hash[i] = data.hash;
        parenthash[i] = data.parentHash;
        var times = new Date(data.timestamp * 1000);

        timestamp[i] = data.timestamp;
        transcation[i] = data.transactions[0];

        if (i == temp - 1) {
          blocklistp(number, hash, parenthash, timestamp, transcation);
        }
      });
    }
    function blocklistp(number, hash, parenthash, timestamp, transcation) {
      var blocktemplate = $("#blocktemplate");
      var blockcol = $("#col");

      for (let i = 0; i < App.blocks; i++) {
        blocktemplate.find(".Number").text(number[i]);

        blocktemplate.find(".hash").text(hash[i]);
        blocktemplate.find(".Phash").text(parenthash[i]);

        blocktemplate.find(".transaction").text(transcation[i]);
        blocktemplate.find(".time").text(timestamp[i]);
        blockcol.append(blocktemplate.html());
      }
    }
    //

    // Load contract data
    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance;

        return electionInstance.candidatesCount();
      })
      .then(function (candidatesCount) {
        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        var candidatesSelect = $("#candidatesSelect");
        candidatesSelect.empty();
        var disabledSelect =
          "<option value='' disabled selected>Select a Candidate</option>";
        candidatesSelect.append(disabledSelect);

        for (var i = 1; i <= candidatesCount; i++) {
          electionInstance.candidates(i).then(function (candidate) {
            var id = candidate[0];
            var name = candidate[1];
            var image = candidate[2];
            var voteCount = candidate[3];

            // Render candidate Result
            var candidateTemplate =
              "<tr><th>" +
              id +
              "</th><td> <img src=" +
              image +
              " style='width: 110px; height: 90px;'></td><td>" +
              name +
              "</td><td >" +
              voteCount +
              "</td></tr>";
            candidatesResults.append(candidateTemplate);

            // Render candidate ballot option
            var candidateOption =
              "<option value='" + id + "' >" + name + "</ option>";
            candidatesSelect.append(candidateOption);
          });
        }

        return electionInstance.voters(App.account);
      })
      .then(function (hasVoted) {
        console.log("inside hasVoted function");
        // Do not allow a user to vote
        if (hasVoted) {
          console.log("Inside if hasVoted");
          $("form").hide();
        }
        loader.hide();
        content.show();
      })
      .catch(function (error) {
        console.warn(error);
      });
  },
  castVote: async function () {
    var candidateId = $("#candidatesSelect").val();

    console.log("CandidateID is:" + candidateId);
    App.contracts.Election.deployed()
      .then(function (instance) {
        if (candidateId == null) {
          //To check whether a candidate is selected or not
          throw new Error("Please Select a candidate!");
        } else {
          console.log(candidateId);
          return instance.vote(candidateId, { from: App.account });
        }
      })
      .then(function (result) {
        // Wait for votes to update
        //console.log("inside then function(result)");
        //$("#content").hide();
        $("form").hide();

        $.confirm({
          title: "Success!",
          content:
            "Thanks For Voting. click OK to refresh the page and to confirm your vote is counted",
          buttons: {
            OK: function () {
              window.location.reload();
            },
          },
        });
      })
      .catch(function (err) {
        $.alert("Please select a candidate!", "Error!");
      });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
