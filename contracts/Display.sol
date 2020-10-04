pragma solidity ^0.4.2;

contract Display{

    struct User{

        uint id;
        address add;
        string image;
    }
    uint public usercount;
    mapping(uint => User) public Users;

    function Display() public{

        addUser(0x5564AA6bD5D7Fa2C4Cd2C3A17C6B8388Be522B48,"img/1.jpg");
        addUser(0x964391a3B1EEe9fAB6FB880046952eaFE0F73253,"img/2.jpg");
        addUser(0x838E2134d9e028503bCac05e564bce30A60F050B,"img/3.jpg");
        addUser(0xE7E494Dc234b0a8FE0d522975d7F347fac4010dE,"img/5.jpg");
        addUser(0xFE4a5705CaE7f722ce19b1D6208952eCB23fDd90,"img/10.jpg");
        addUser(0x23edc8DE2d05ABBDD97817079F499dFED9397E0c,"img/14.jpg");
        addUser(0x5015E1D0138dB9A18fD950BC5852322884A3F2D2,"img/27.jpg");
        addUser(0x9D9a57C976d3a4E77498C2778D2B8705507675eE,"img/33.jpg");
        addUser(0x816544a61CE3C73D0fDFa70f5d2bb7147180b281,"img/9.jpg");
        addUser(0xe5aB292d6A2320E79E836CC3d32dB4Fcc2890c81,"img/11.jpg");


    }

    function addUser (address _Address,string _image) private {
        
        usercount++;
        Users[usercount] = User(usercount, _Address,_image);
    }
 


}