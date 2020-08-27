pragma solidity ^0.4.2;
contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        string pic;
        uint voteCount;
    }

    
       
    // Store accounts that have voted
    mapping(address => bool) public voters;

    // Store Candidates
    // Fetch Candidate
    // Read/write candidates
    mapping(uint => Candidate) public candidates;

    // Store Candidates Count
    uint public candidatesCount;
    uint public voterc=0;

    // voted event
    event votedEvent (
        uint indexed _candidateId
    );

    function Election () public {
        addCandidate("Candidate 1","img/dj.png");
        addCandidate("Candidate 2","img/Household-Fan-icon.png");
        addCandidate("Candidate 3","img/fan.png");
       
    }

    function addCandidate (string _name,string _image) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name,_image, 0);
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        

        // record that voter has voted
        voters[msg.sender] = true;
       
        // update candidate vote Countsss
        candidates[_candidateId].voteCount ++;
             voterc++;
        // trigger voted event
        emit votedEvent(_candidateId);
    }
}
