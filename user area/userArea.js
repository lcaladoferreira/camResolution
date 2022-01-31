window.pusher_key = "";

var mapboxPK = "pk.eyJ1IjoiY2FlcnVzZ2VvIiwiYSI6Ikp2dHd0NVEifQ.LdwLOxJy8PCtF19Ue7sCFA";

function makeList(introText, listData, parent) {
    var intro = document.createElement('p');
    var listElement = document.createElement('ul');
    intro.style.fontSize = '90%';

    intro.innerHTML = introText;

    listElement.style.padding = '16px';

    var numberOfListItems = listData.length;
    var listItem;
    var i;


    parent.innerHTML = '';
    parent.appendChild(intro);
    parent.appendChild(listElement);

    for (i = 0; i < numberOfListItems; ++i) {
        listItem = document.createElement('li');

        var date = document.createElement('strong');
        date.innerHTML = new Date(listData[i].created_at).toLocaleString() + ": ";

        var reasons = listData[i].moderation_reasons;
        var reasonsNode = document.createElement('span')

        for (var j = 0; j < reasons.length; j++) {
            var reasonNode = document.createElement('a');
            reasonNode.innerHTML = reasons[j].label;
            reasonNode.setAttribute('href', 'intercom://' + reasons[j].helpArticle);
            reasonsNode.appendChild(reasonNode);
            if (j + 1 < reasons.length) {
                var text = document.createTextNode(', ');
                reasonsNode.appendChild(text);
            }
        }


        listItem.appendChild(date)
        listItem.appendChild(reasonsNode)

        listElement.appendChild(listItem);
    }
}

// Usage

function getRejectionReasons(taskId, taskTitle) {
    axios.get('/users/rejections_for_task.json?task_id=' + taskId).then(function (resp) {
        var rejectionsForTask = resp.data.rejected_entries;

        var modalTitle = document.getElementById('rejectionReasonModalTitle');
        modalTitle.innerText = taskTitle;

        var modalBody = document.getElementById('rejectionReasonModalBody');
        makeList(resp.data.intro, rejectionsForTask, modalBody);
    });
}

window.intercomSettings = {
    app_id: "",
    name: "",
    user_id: "",
    email: "",
    user_hash: "",
    alignment: 'right'
};

(function () { var w = window; var ic = w.Intercom; if (typeof ic === "function") { ic('reattach_activator'); ic('update', w.intercomSettings); } else { var d = document; var i = function () { i.c(arguments); }; i.q = []; i.c = function (args) { i.q.push(args); }; w.Intercom = i; var l = function () { var s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://widget.intercom.io/widget/jrrdc3d6'; var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); }; if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); } } })();


document.addEventListener("DOMContentLoaded", function(){
    $("#user_phone").intlTelInput({nationalMode:false,utilsScript:'/utils2.js'});
    $('select.form-control').removeClass('form-control').addClass('form-select')
  })
  var completed_exists = false
  
  document.addEventListener("DOMContentLoaded", function(){
  
    $('.nav-link').on('shown.bs.tab', function (e) {
      if ($(e.target).attr('href') == "#payment") {
        $("#weekPayoutChart").empty()
        $("#earningsTypes").empty()
        if (completed_exists) {
          var payouts_by_week = []
          var datasets = [
            { 
              name: "Payout Total",
              values: _.values(payouts_by_week).map(function (obj) {
                return (obj / 100).toFixed(2)
              })
            }
          ]
  
          var dateKeys = Object.keys(payouts_by_week);
          var dateKeys = _.map(dateKeys, function(someDate) {
            return someDate.slice(5)
          })
          var barChart = new frappe.Chart("#weekPayoutChart", {
            data: {
              labels: dateKeys,
              datasets: datasets
            },
            type: "bar",
            colors:['green'],
            axisOptions: {
              xAxisMode: "tick"
            }
          })
        } else {
          $("#payout_chart_section").hide()
        }
  
  
        var entries = []
        var verifications = []
        var referrals = []
  
        var datasets = [
          { 
            name: "Entries",
            values: _.values(entries).map(function (obj) {
                return (obj / 100).toFixed(2);
            })
          },
          {
            name: "Verification",
            values: _.values(verifications).map(function (obj) {
                return (obj / 100).toFixed(2);
            })
          },
          { 
            name: "Referrals",
            values: _.values(referrals).map(function (obj) {
                return (obj / 100).toFixed(2);
            })
          }
        ]
  
        var dateKeys = Object.keys(entries);
        var dateKeys = _.map(dateKeys, function(someDate) {
          return someDate.slice(5)
        })
  
        var barChart = new frappe.Chart("#earningsTypes", {
          data: {
            labels: dateKeys,
            datasets: datasets
          },
          type: "bar",
          colors:['#001f3f','#0074D9','#7FDBFF'],
          axisOptions: {
            xAxisMode: "tick"
          }
        })
  
      }
    })
  
    if ($('#flash_notice').text().indexOf('payment') != -1) {
      $("#stripeLink").click()
    }
  
  
  
    var remitly_details = {"pickup":["SICOOB (Only in Menas Gerais)"],"deposit":[]}
  
    $("#user_payout_method").change(function() {
      var options = ["<option>Choose Location</option>"]
  
      $(".user_remitly_bank").hide()
      $(".user_remitly_bank_acct").hide()
      $(".user_paypal_address").hide()
  
      if ($("#user_payout_method").val() == "0" || $("#user_payout_method").val() == "6" || $("#user_payout_method").val() == "8" || $("#user_payout_method").val() == "9") {
        $(".user_paypal_address").show()
      }
  
      else if ($("#user_payout_method").val() == "1" && remitly_details) {
        $(".user_remitly_bank").show()
        $(".user_remitly_bank_acct").show()
  
        remitly_details.deposit.forEach(function(location) {
          options.push("<option>"+location+"</option>")
        })
  
        $("#user_remitly_bank").html(options.join(''))
      } else if ($("#user_payout_method").val() == "2" && remitly_details) {
        $(".user_remitly_bank").show()
  
        remitly_details.pickup.forEach(function(location) {
          options.push("<option>"+location+"</option>")
        })
        $("#user_remitly_bank").html(options.join(''))
  
      }
    })
    $("#user_payout_method").change()
    $("#user_remitly_bank").val("")
    $("#user_remitly_bank_acct").val("")
  });