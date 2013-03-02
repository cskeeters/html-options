var all_reqs = [];

function get_reqs(el) {
  var reqs = $(el).attr("data-req");
  if (!reqs) return [];
  reqs = reqs.replace(/(\r\n|\n|\r)/gm," ");
  reqs = reqs.split(" ").map($.trim);
  while (reqs.indexOf('') != -1) {
    reqs.splice(all_reqs.indexOf(''), 1);
  }
  return reqs;
}

function matches(el, on) {
  if (on.length == 0) return true;

  var reqs = get_reqs(el);

  for (var i in on) {
    //console.log("checking "+on[i]);
    if ($.inArray(on[i], reqs) == -1) {
      //console.log("does not have "+on[i]);
      return false;
    }
  }

  return true;
}

function is_on(req) {
  return $("#"+req).hasClass("active");
}

function get_on() {
  var on = [];
  for (var i in all_reqs) {
    //console.log("checking "+all_reqs[i]);
    var checked = is_on(all_reqs[i]);
    if (checked) {
      on.push(all_reqs[i]);
    }
  }
  return on;
}

function calc_min_price(reqs) {
  var min_price = "999999";
  $(".opt").each(function() {
    if (matches(this, reqs)) {
      var price = parseInt($(this).attr("data-price"));
      if (price < min_price) {
        min_price = price;
      }
    }
  });
  if (min_price == "999999") return "N/A"
  return min_price;
}

function update_costs() {
  var on = get_on();
  var base_cost = calc_min_price(on);
  for (var i in all_reqs) {
    var req = all_reqs[i];
    var on = get_on();
    if (is_on(req)) {
      on.splice(on.indexOf(req), 1);
    } else {
      on.push(req);
    }
    var min_price = calc_min_price(on);
    console.log(on+" "+min_price);
    $('#'+req).html($("#"+req).attr('id')+" $"+(min_price-base_cost));
  }
}

function filter_change() {
  $(this).toggleClass("active");

  var on = get_on();
  console.log("Currnetly Checked:");
  console.log(on);

  $(".opt").each(function() {
    if (matches(this, on)) {
      $(this).removeClass("hidden");
    } else {
      $(this).addClass("hidden");
    }
  });
  update_costs();
}

function transform(el) {
  var name = $(el).attr("data-name");
  var price = $(el).attr("data-price");
  $(el).html("<h2>"+name+" - $"+price+"</h2>"+$(el).html());
}

$(document).ready(function () {
  $(".opt").each(function(index) {
    var reqs = get_reqs(this);
    all_reqs = all_reqs.concat(reqs);
    transform(this);
  });

  //removes duplicates
  all_reqs = all_reqs.filter(function(elem, pos) {
      // return true (match/keep) if the first index of the element is equal to the current position
      return all_reqs.indexOf(elem) == pos;
  });

  all_reqs = all_reqs.sort();
  if (all_reqs.indexOf('') != -1) {
    all_reqs.splice(all_reqs.indexOf(''), 1);
  }
  console.log('All Requirements ' + all_reqs);

  var filter_html = "";
  for (var i in all_reqs) {
    var req = all_reqs[i];
    console.log(all_reqs[i]);
    filter_html += '<button id="'+req+'" type="button" class="btn btn-primary check" data-toggle="button" onclick="filter_change()">'+req+'</button>';
  }
  filter_html += "<br>";
  filter_html += "<br>";

  $("#filter").html($("#filter").html()+filter_html);

  $("button.check").click(filter_change);

  update_costs();
});

