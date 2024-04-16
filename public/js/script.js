$(document).ready(function () {
    var account="0x7996B8066E354219caf75b9D9EEf9f59c0361Ae1";
     //   connect the contract with window
    const ABI = [
        {
          inputs: [],
          name: "deposit",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "getAddress",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getBalance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address payable",
              name: "_to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
          ],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
    ];
    const contractAddress = "0xbFD196df28208e84DE102AACf95Aa93dEA385b18";

    const handleLogin = async () => {
      var userStatus;
      try {
          const accounts = await ethereum.request({method: "eth_requestAccounts"});
          userStatus = accounts[0];
          $('#main').show();
          $('#loginMeta').hide();
      } catch (error) {
          if(userStatus === undefined)
          {
              $('#loginMeta').show();
          }
      }
    }

    // login starts
    handleLogin();

    $('#loginMeta').on('click',function(e){
      e.preventDefault();
      location.reload();
    });

    // login ends
    if (typeof window.ethereum !== "undefined") {
      console.log("Metamask is installed");
    } else {
      console.error("please install Metamask to use this app");
    }
  
    if (document.getElementById("connectWallet")) {
      document.getElementById("connectWallet").onclick = async () => {
        console.log("connecting to wallet");
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        window.localStorage.setItem("accountId", account);
        window.location.href = "/products";
      };
    }
  
    const captureAccount = async () => {
      if (window.ethereum !== "undefined") {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        account = accounts[0];
      }
    };
  
    const displayBalance = async () => {
      window.web3 = await new Web3(window.ethereum);
      window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
  
      // display the current balance in the smart contract
      const balance = await window.contract.methods.getBalance().call();
      const ETHBalance = window.web3.utils.fromWei(balance, "ether");
  
  
      $("#etherBalance")
        .empty()
        .append("(" + ETHBalance + " ETH)");
    };
  
    const connectWindowAndContract = async () => {
      window.web3 = await new Web3(window.ethereum);
      window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
    };
  
    const depositEtherToContract = async (price) => {
      //   connect the contract with window
      window.web3 = new Web3(window.ethereum);
      window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
      const priceWei = window.web3.utils.toWei(String(price), 'ether');
      // deposit the amount in to the contract
      await window.contract.methods
        .deposit()
        .send({ from: account, value: priceWei });
      return true;
    };
  
    const withDrawAmount = async (amount, address) => {
      window.web3 = new Web3(window.ethereum);
      window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
  
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
  
      // Convert Ether amount to Wei
      const amountInWei = window.web3.utils.toWei(amount.toString(), "ether");
  
      // Withdraw the amount from the contract
      await window.contract.methods
        .withdraw(address, amountInWei)
        .send({ from: account });
  
      // Clear values from input fields
      $("#accountAddress").val("");
      $("#enteredEther").val("");
    };
  
    $(".buyItem").on("click", function () {
      // get the price
      var price = "0.00001";
      console.log(price);
      depositEtherToContract(price);
    });
  
    if (document.getElementById("redeemEther")) {
      displayBalance();
    }
  
    $("#redeemNow").on("click", function (e) {
      e.preventDefault();
      const address = document.getElementById("accountAddress").value;
      const amount = document.getElementById("enteredEther").value;
      withDrawAmount(amount, address);
    });

    $(".tab-slider--body").hide();
    $(".tab-slider--body:first").show();

    $(".tab-slider--nav li").click(function() {
      $(".tab-slider--body").hide();
      var activeTab = $(this).attr("rel");
      $("#"+activeTab).fadeIn();
      if($(this).attr("rel") == "tab2"){
        $('.tab-slider--tabs').addClass('slide');
      }else{
        $('.tab-slider--tabs').removeClass('slide');
      }
      $(".tab-slider--nav li").removeClass("active");
      $(this).addClass("active");
    });

    const connectMetamask = async () => {

      
      if (window.ethereum !== undefined) {
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });
          account = accounts[0];
          document.getElementById("userArea").innerHTML = `User Account: ${account}`;
      }else{
        ethereum.request({ method: 'eth_requestAccounts' });
      }
    }

    const connectContract = async () => {
      window.web3 = new Web3(window.ethereum);
      window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
      document.getElementById("contractArea").innerHTML = "Connected to Contract"; // calling the elementID above
    }

    const getContractAccount = async () => {
      const data = await window.contract.methods.getAddress().call();
      document.getElementById("contractAccount").innerHTML = `Contract Account: ${data}`;
    }

    const getBalance = async () => { // const getBalance is the HTML function & .contract.getBalance is the smart contract function
      const data = await window.contract.methods.getBalance().call();
      const ETHBalance = window.web3.utils.fromWei(data, "ether");
      document.getElementById("balanceArea").innerHTML = `Contract Balance: ${ETHBalance} ETH`;
    }

    const depositContract = async () => {
      const amount = document.getElementById("depositInput").value;
      const amountInWei = window.web3.utils.toWei(amount, "ether");
      await window.contract.methods.deposit().send({ from: account, value: amountInWei });
    }

    const withdraw = async () => {
      const amount = document.getElementById("amountInput").value;
      const address = document.getElementById("addressInput").value;
      // Convert amount to Wei
      const amountInWei = window.web3.utils.toWei(amount, "ether");
      await window.contract.methods.withdraw(address, amountInWei).send({ from: account });
    }



    $('#connectMetamask').on('click', function(e) {
      e.preventDefault();
      connectMetamask();

    });

    $('#connectContract').on('click', function(e) {
      e.preventDefault();
      connectContract();

    });

    $('#getContractAccount').on('click', function(e) {
      e.preventDefault();
      getContractAccount();

    });

    $('#getBalance').on('click', function(e) {
      e.preventDefault();
      getBalance();
    });

    $('#depositContract').on('click', function(e) {
      e.preventDefault();
      depositContract();

    });

    $('#withdraw').on('click', function(e) {
      e.preventDefault();
      withdraw();
    });

  });
  