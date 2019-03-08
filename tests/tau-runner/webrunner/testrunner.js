/*
Copyright (c) 2013 Intel Corporation.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of works must retain the original copyright notice, this list
  of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the original copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.
* Neither the name of Intel Corporation nor the names of its contributors
  may be used to endorse or promote products derived from this work without
  specific prior written permission.

THIS SOFTWARE IS PROVIDED BY INTEL CORPORATION "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL INTEL CORPORATION BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Authors:
        Wang, Jing <jing.j.wang@intel.com>

*/
var STUB_PORT = "";
var RESOURCE_DIR;
$.ajax({
  url:"/opt/usr/home/owner/share/TCT_CONFIG",
  data:{},
  async:false,
  success:function(data){
    var regEx = /DEVICE_SUITE_TARGET_30=(.+)/i;
    var path = regEx.exec(data);
    RESOURCE_DIR = path[1];
  }
});
$.ajax({
  url:RESOURCE_DIR + "/tct/portconfigure.json",
  dataType:"json",
  data:{},
  async:false,
  success:function(data){
    STUB_PORT = data[0]["STUB_PORT"];
  }
});
(function (window){
  function TestRunner() {
    this.start = null;
    this.ui = null;
    this.submitResult = function () {};
    this.report = function (result, message) {};
    this.doTest = function () {};
  }

  TestRunner.prototype = (function () {
    var index = -1;
    var Tests = [];
    var Testsuites = {};
    var TestsuiteSums = {};
    var TestsetSums =  {};
    var sum = newSummary();
    var testContext =  newTestContext();
    function newSummary(sum) {
      if (typeof sum === "undefined")
        return {"TOTAL": 0, "PASS" : 0, "FAIL" : 0, "BLOCK" : 0, "NOTRUN" : 0};
      return {"TOTAL": sum.TOTAL, "PASS": sum.PASS, "FAIL": sum.FAIL, "BLOCK": sum.BLOCK, "NOTRUN": sum.NOTRUN};
    }
    function newTestContext() {
      return {start_time: null, prev_uri: "", uri: "", sub_index: 0, onload_delay: 0};
    }
    function getParms () {
      var parms = {};
      var items = location.search.substring(1).split('&');
      for ( var i = 0, max = items.length; i < max; i++) {
        var pos = items[i].indexOf('=');
        if (pos > 0) {
          var key = items[i].substring(0, pos);
          var val = items[i].substring(pos + 1);
          if (!parms[key]) {
            var rawVal = decodeURI(val);
            if (rawVal.indexOf(',') < 0)
              parms[key] = rawVal;
            else
              parms[key] = rawVal.split(',');
          }
        } else
           parms[items[i]] = 1;
      }
      return parms;
    }
    return {
      constructor: TestRunner,
      options:  getParms(),
      addTestsuite: function (testsuite, category) {
        if (!category)
          category = "default";
        if (typeof Testsuites[category] === "undefined")
          Testsuites[category] = [];
        Testsuites[category].push(testsuite);
      },

      goNext: function () {
        if (Tests.length === 0) return false;
        if (index >= Tests.length) {
          index = -1;
          return false;
        }
        index++;
        return true;
      },

      goPrev: function () {
        if (Tests.length === 0) return false;
        if (index < 0) {
          index = Tests.length;
          return false;
        }
        index--;
        return true;
      },

      runAll: function () {
        testContext = newTestContext();
        VIEWFLAGS.add("batch");
        this.ui.updateView(VIEWFLAGS.del("suite"));
        this.testIndex(-1);
        this.doTest();
      },

      cleanTests: function () {
        Tests = [];
      },

      testIndex: function (ind) {
        if (typeof ind === "undefined")
          return index;
        index = ind;
      },

      getTest: function (ind) {
        if (typeof ind === "undefined")
          ind = index;
        return Tests[ind];
      },

      addTest: function (test) {
        if (test instanceof Array)
          Tests = Tests.concat(test);
        else
          Tests.push(test);
      },

      sumInit: function (num) {
        if (typeof num === "undefined")
          num = Tests.length;
        sum.TOTAL = sum.NOTRUN = num;
        sum.PASS = sum.FAIL = sum.BLOCK = 0;
      },

      sumUpdate: function (oldRes, newRes, set) {
        if (oldRes !== null) {
          sum[oldRes]--;
          if (set !== null) TestsetSums[set][oldRes]--;
        }
        if (newRes !== null) {
          sum[newRes]++;
          if (set != null) TestsetSums[set][newRes]++;
        }
      },

      checkResult: function (oTestDoc) {
        var message = "";
        if (!oTestDoc) {
          this.report('FAIL', 'Test page crash');
          return true;
        }
        // Handle sub-index test
        if (testContext.sub_index > 0) {
          var oRes = $(oTestDoc).find("table#results");
          if (oRes.length == 0)
            return false;
          var ind = testContext.sub_index - 1;
          var $n = $(oRes).find('tbody > tr').eq(ind);
          if ($n.length == 0)
            return false
          var result = $n.children("td:eq(0)").text();
          message = $n.children("td:eq(2)").text();
          this.report(result.toUpperCase(), message);
          return true;
        }

        var oPass = $(oTestDoc).find(".pass");
        var oFail = $(oTestDoc).find(".fail");
        // Qunit sub-cases
        var oUnitRes = $(oTestDoc).find("ol.qunit-assert-list");
        $(oUnitRes).find('li').each(function() {
          message += "[assert]" + $(this).attr("class");
          message += "[message]*" + $(this).children("span").text() + "\n";
        });
        // All tests pass
        if (oPass.length > 0 && oFail.length == 0) {
          this.report('PASS', message);
          return true;
        }
        // Handle failed tests
        if (oFail.length > 0) {
          var oRes = $(oTestDoc).find("table#results");
          $(oRes).find('tr.fail').each(function() {
            message += " *" + $(this).children("td:eq(1)").text() + ": ";
            message += $(this).children("td:eq(2)").text();
          });
          this.report('FAIL', message);
          return true;
        }
        return false;
      },

      testInfo: function (ind) {
        var info = "";
        var tc = this.getTest();
        if (!tc) return info;
        info += "Test   : (" + (index + 1) + "/" + sum.TOTAL + ") ";
        info += tc.test_script_entry;
        info += "\nPurpose: " +  tc.purpose;
        if (tc.pre_condition)
          info += "\nPrecondition: " + tc.pre_condition;
        if (tc.steps)
          info += "\n" + tc.steps;
        return info;
      },

      getTestCaseUrl: function () {
        function getUriField(uri, param) {
          var querys = uri.split("?")
          if (querys.length <= 1)
            return "";
          uri = querys[1];
          var start = uri.indexOf(param);
          if (start == -1)
            return "";
          start += param.length + 1;
          var end = uri.indexOf("&", start);
          if (end == -1)
            return uri.substring(start);
          return uri.substring(start, end);
        }
        var tc = this.getTest();
        if (!tc) return null;
        var delay = tc.onload_delay;
        if (delay)
          testContext.onload_delay = parseInt(delay) * 1000;
        else
          testContext.onload_delay = 5000;

        var uri = tc.test_script_entry;
        if (typeof this.options.testprefix !== "undefined") {
          var pos = uri.indexOf('http://');
          if (pos !== 0)
            uri = this.options.testprefix + uri
        }
        var val = getUriField(uri, "value");
        if (val && tc.execution_type == "auto" && VIEWFLAGS.has("batch")) { // Need sub index in TC
          testContext.sub_index = parseInt(val);
          testContext.uri = uri.split("?")[0];
          if (testContext.uri == testContext.prev_uri)
            return "";
        } else {
          testContext.uri = uri;
          testContext.sub_index = 0;
        }
        testContext.prev_uri = testContext.uri;
        testContext.start_time = new Date();
        return testContext.uri;
      },

      loadReady: function () {
        if (!VIEWFLAGS.has("batch"))
          return;
        if (!this.ui.testComplete()){
          if (testContext.onload_delay > 0){
            var tval = 500;
            var self = this;
            setTimeout(function() {self.loadReady();}, tval);
            testContext.onload_delay -= tval;
            return
          }
          this.report("BLOCK", "Timeout");
        }
        this.doTest();
      },

      getListSum: function () {
        var sumdata = "";
        sumdata += "<p><table id='browse'><tr><th>Testsuite</th>";
        sumdata += "<th>Total</th><th>Pass</th><th>Fail</th><th>Block</th></tr>";
        $.each(TestsuiteSums, function (key, val){
          sumdata += "<tr><td>" + key+ "</td>";
          sumdata += "<td style='color:black;'>" + val.TOTAL + "</td>";
          sumdata += "<td style='color:green;'>" + val.PASS + "</td>";
          sumdata += "<td style='color:red;'>" + val.FAIL + "</td>";
          sumdata += "<td style='color:orange;'>" + val.BLOCK + "</td></tr>";
        });
        sumdata += "</table>";
        return sumdata;
      },

      getTestSum: function (include_set) {
        var sumdata = "<section><h3>Total:" + sum.TOTAL
            + " Pass:<span style='color:green;'>" + sum.PASS
            + "</span> Fail:<span style='color:red;'>" + sum.FAIL
            + "</span> Block:<span style='color:orange;'>" + sum.BLOCK
            + "</span> Notrun:<span style='color:black;'>" + sum.NOTRUN
            + "</span>";
                                if (this.options.notifyInfo) {
          sumdata += "<span style='color:slateblue;'> " + this.options.notifyInfo + "</span>";
          this.options.notifyInfo = "";
        }
        sumdata += "</h3></section>";
        if (VIEWFLAGS.has("batch")) {
          var tc = this.getTest();
          if (tc)  sumdata += "<h4><span style='background-color: wheat'>(#" + index + ") " + tc.id + "</span></h4>";
        }
        if (this.options.testsuite_name)
          TestsuiteSums[this.options.testsuite_name] = newSummary(sum)
        if (include_set) {
          sumdata += "<p><table id='browse'><tr><th>Testset</th>";
          sumdata += "<th>Total</th><th>Pass</th><th>Fail</th><th>Block</th></tr>";
          $.each(TestsetSums, function (key, val){
            sumdata += "<tr><td>" + key+ "</td>";
            sumdata += "<td style='color:black;'>" + val.TOTAL + "</td>";
            sumdata += "<td style='color:green;'>" + val.PASS + "</td>";
            sumdata += "<td style='color:red;'>" + val.FAIL + "</td>";
            sumdata += "<td style='color:orange;'>" + val.BLOCK + "</td></tr>";
          });
          sumdata += "</table>";
        }
        return sumdata;
      },

      getListInfo: function () {
        function createList(category) {
          var testList = "";
          $.each(Testsuites[category], function (ind, val) {
            testList += "<li><input type='checkbox' id='" + val + "'>&nbsp;<a href=''>" + val + "</a>" + "</li>";
          });
          return testList;
        }
        var data = "<html><head><style>.category{background: #cccccc;border: 1px solid #aaaaaa;} li{list-style-type: none; padding-left: 0.6em; padding-bottom:0.8em; font-size: 1.3em;}html{font-family:DejaVu Sans, Bitstream Vera Sans, Arial, Sans;}</style></head><body>";
        $.each(Testsuites, function(key, val) {
          data += "<section><h3 class='category'><input type='checkbox' id='" + key + "'>&nbsp;" + key + "</h3>"
          data +=  createList(key) + "</section>";
        });
        data += "</body></html>";
        return data;
      },

      getBrowseInfo: function () {
        var failList = passList = blockList = notrunList = "";
        function createTestList(tc, color, ind) {
          var mtag = (tc.execution_type === "manual") ? "(M)" : "";
          return "<li>" + mtag + "<a rel='" + ind + "' href='' style ='color:" + color + ";'>" + tc.id + "</a>" + "</li>";
        }
        TestsetSums = {};
        $.each(Tests, function (ind, val) {
          if (this.set === null)
            this.set = "default";
          if (typeof TestsetSums[this.set] === "undefined")
            TestsetSums[this.set] = newSummary();
          TestsetSums[this.set][this.result]++;
          TestsetSums[this.set]["TOTAL"]++;
          if (this.result == "FAIL")
            failList += createTestList(this, "red", ind);
          if (this.result == "PASS")
            passList += createTestList(this, "green", ind);
          if (this.result == "BLOCK")
            blockList += createTestList(this, "orange", ind);
          if (this.result == "NOTRUN")
            notrunList += createTestList(this, "black", ind);
        });
        var data = "<html><head><style>ul li {padding-bottom:0.8em;font-size: 1.3em;}";
        data += "html{font-family:DejaVu Sans, Bitstream Vera Sans, Arial, Sans;}</style></head><body>";
        if (notrunList)
          data += "<section><h3>Notrun</h3><ul>" + notrunList + "</ul></section>";
        if (failList)
          data += "<section><h3 style='color: red;'>Fail</h3><ul>" + failList + "</ul></section>";
        if (blockList)
          data += "<section><h3 style='color: orange;'>Block</h3><ul>" + blockList + "</ul></section>";
        if (passList)
          data += "<section><h3 style='color: green'>Pass</h3><ul>" + passList + "</ul></section>";
        data += "</body></html>";
        return data;
      },

      TestCase: function () {
        return {
          id: null,
          test_script_entry: null,
          execution_type: "manual",
          result: "NOTRUN",
          purpose: "",
          set: null,
          pre_condition: "",
          onload_delay: 0,
          steps: "",
          data: null};
      },

      TestSuite: function () {
        return {
          id: null,
          sum: null,
          data: null};
      }

    };
     }());
  // Standalone test runner
  var master_runner = new TestRunner();
  master_runner.start = function (ui) {
    function filter(xml, self) {
      var set_ind = 0;
      var manuals = [];
      $(xml).find("set").each(function () {
        var setname = $(this).attr("name");
        if (!setname)
          setname = "set" + set_ind;
        $(this).find("testcase").each(function () {
          var v = $(this).attr('execution_type');
          if (self.options.execution_type && v != self.options.execution_type
              && $.inArray(v, self.options.execution_type) < 0) {
            $(this).remove();
            return;
          }
          v = $(this).attr('priority');
          if (self.options.priority && v != self.options.priority
              && $.inArray(v, self.options.priority) < 0){
            $(this).remove();
            return;
          }
          var test = self.TestCase();
          test.id = $(this).attr("id");
          test.execution_type = $(this).attr("execution_type");
          test.test_script_entry = $(this).find("test_script_entry").text();
          test.purpose = $(this).attr("purpose");
          test.pre_condition = $(this).find("pre_condition").text();
          test.onload_delay = $(this).attr("onload_delay");
          test.result = "NOTRUN";
          test.set = setname;
          test.data = this;
          if (test.execution_type === "auto")
            self.addTest(test);
          else
            manuals.push(test);
        });
        set_ind++;
      });
      self.addTest(manuals);
    }

    var self = this;
    if (ui) ui.bind(self);
    if (self.options.testsuite_name)
      self.options.testsuite = "opt/" + self.options.testsuite_name + "/tests.xml";
    if (!self.options.testsuite) {
      $.getJSON(TESTLIST_FILE, function(data) {
        for (var i = 0, imax = data.length; i < imax; i++) {
          for (var j = 0, jmax = data[i].tests.length; j < jmax; j++)
            self.addTestsuite(data[i].tests[j], data[i].category);
        }
        self.ui.list();
        self.options.multiplex = true;
      });
    } else {
      $.get(self.options.testsuite, null, function (xml) {
        self.internal.xmldoc = xml;
        filter(xml, self);
        self.sumInit();
        self.ui.browse();
        setTimeout(function () {
        if (self.options.autorun)
          self.runAll();
        }, 500);
      }, "xml");
    }
  };

  master_runner.doTest = function () {
    var self = this, tc = null;
    while (self.goNext()) {
      tc = self.getTest();
      if (!tc || tc.execution_type === "manual")
        break;
      self.ui.updateTestInfo(self.testInfo(), null, null);
      self.ui.runTest(self.getTestCaseUrl());
      return;
    }
    this.ui.updateView(VIEWFLAGS.del("batch"));
    if (self.options.autorun) {
      self.submitResult();
      if (self.options.multiplex) {
        self.ui.list();
        return;
      }
      close_window();
      return;
    }
    if (!tc) {
      setTimeout(function () {self.ui.browse();}, 500);
      return;
    }
    this.ui.updateTest();
  };

  master_runner.report = function (result, log) {
    var tc = this.getTest();
    if (!tc) return;
    var oldresult = tc.result;
    this.sumUpdate(oldresult, result, tc.set);
    tc.result = result;
    $(tc.data).find('result_info').remove();
    $(tc.data).attr('result', result);
    var doc = $.parseXML("<result_info><actual_result>" + result +
           "</actual_result><stdout>" +
           escape_html(log) + "</stdout></result_info>");
    $(tc.data).append(doc.documentElement);
    if (VIEWFLAGS.has("batch")) result = null;
    this.ui.updateTestInfo(null, this.getTestSum(false), result);
  };

  master_runner.submitResult = function () {
    var SERVER = "http://127.0.0.1:8080";
    var contents = (new XMLSerializer()).serializeToString(this.internal.xmldoc);
    var resfile = "tests.res.xml";
    if (this.options.testsuite_name)
      resfile = this.options.testsuite_name + "." + resfile;
    $.post(SERVER + "/save_file", {filename: resfile, data: contents})
  };

  master_runner.internal = {xmldoc: null};

  // Controlled test runner
  var slave_runner = new TestRunner();
  slave_runner.start = function (ui) {
    function sync_session_id() {
      $.get(SERVER + "/init_session_id?session_id="
            + self.internal.session_id);
    }
    var self = this;
    self.internal.session_id = Math.round(Math.random() * 10000);
    sync_session_id();
    var next_step = self.internal.get_json("ask_next_step");
    if (!next_step || next_step.step != "continue") {
      close_window();
      return false;
    }
    ui.bind(self);
    var f = function () {
      var p = self.internal.get_json("check_execution_progress");
      if (p) self.sumInit(parseInt(p.total));
      self.doTest();
    };
    self.ui.updateView(VIEWFLAGS.add("batch"));
    self.ui.updateView(VIEWFLAGS.del("suite"));
    setTimeout(f, 1000);
    return true;
  };

  slave_runner.doTest = function () {
    var self = this;
    if (self.internal.stage > 0) {
      self.ui.updateView(VIEWFLAGS.del("batch"));
      self.goNext();
      self.ui.updateTest();
      return;
    }
    var next_step = self.internal.get_json("ask_next_step");
    if (next_step && next_step.step == "continue") {
      var task = self.internal.get_json("auto_test_task");
      if (task === null) {
        print_error("ask_test_task", "Fail get task");
      } else if (task.invalid === 0) {
        print_error("ask_test_task", "Invalid session");
      } else if (task.stop === 0) {
        print_error("ask_test_task", "close window");
      } else if (task.none !== 0) { //handle auto test
        var test = self.TestCase();
        test.id = task.case_id;
        test.onload_delay = task.onload_delay;
        test.test_script_entry = task.entry;
        test.execution_type = "auto";
        test.purpose = task.purpose;
        test.pre_condition = task.pre_condition;
        self.addTest(test);
        self.goNext();
        self.ui.updateTestInfo(self.testInfo(), null, null);
        self.ui.runTest(self.getTestCaseUrl());
        return;
      } else {  //handle manual test
        self.ui.updateView(VIEWFLAGS.del("batch"));
        self.internal.stage = 1;
        var mtask = self.internal.get_json("manual_cases");
        if (mtask && mtask.none != 0) {
          self.cleanTests();
          for (var i = 0, max = mtask.length; i < max; i++) {
            var test = self.TestCase();
            test.id = mtask[i].case_id;
            test.test_script_entry = mtask[i].entry;
            test.purpose = mtask[i].purpose;
            test.pre_condition = mtask[i].pre_condition;
            test.result = "NOTRUN";
            test.execution_type = "manual";
            test.index = i;
            var steps = "";
            $(mtask[i].steps).each(function () {
              steps += "Step-" + this.order + "\t: " + this.step_desc + "\n";
              steps += "Expect\t: " + this.expected + "\n";
            });
            test.steps = steps;
            self.addTest(test);
          }
          self.ui.updateTest(-1);
          self.sumInit();
          self.ui.browse();
        } else
          close_window();
        return;
      }
    }
    close_window();
  };

  slave_runner.report = function(result, log) {
    var tc = this.getTest();
    var oldresult;
    if (this.internal.stage > 0) {
      this.internal.post_json("commit_manual_result",
        {"case_id": tc.id, "result": result});
      oldresult = tc.result
      tc.result = result;
    } else {
      this.internal.post_json("commit_result",
        { "case_id" : tc.id,
          "result" : result,
          "msg" : "[Message]" + log,
          "session_id" : this.internal.session_id});
      oldresult = "NOTRUN";
    }
    this.sumUpdate(oldresult, result, null);
    if (VIEWFLAGS.has("batch")) result = null;
    this.ui.updateTestInfo(null, this.getTestSum(false), result);
  };

  slave_runner.submitResult = function () {
    $.get(SERVER + "/generate_xml");
  };

  slave_runner.internal = {
    session_id: null,
    stage: 0,
    get_json: function (name) {
      var jsondata = null;
      $.getJSON(SERVER + "/" + name + "?session_id="
         + this.session_id, function(data) {
           jsondata = data;});
      return jsondata; },
    post_json: function (name, d) {
       $.post(SERVER + "/" + name, d, null, "json");
    }
  };

  var i_ui = (function () {
    var testinfo = $("#testinfo").get(0);
    var frmTest = $("#frmTest").get(0);
    var textTest  = $("#textTest").get(0);
    var btnPass = $("#btnPass").get(0);
    var btnFail = $("#btnFail").get(0);
    var btnBlock = $("#btnBlock").get(0);
    var btnExit = $("#btnExit").get(0);
    var btnNext = $("#btnNext").get(0);
    var btnPrev = $("#btnPrev").get(0);
    var btnRun  = $("#btnRun").get(0);
    var divSum = $("#divSum").get(0);
    var btnBack = $("#btnBack").get(0);
    var btnSave = $("#btnSave").get(0);
    var runner = null;
    var listmode = null;
    var nextTest = function () {
      runner.goNext();
      selectTest();
    };

    var prevTest = function() {
      runner.goPrev();
      selectTest();
    };

    var selectResult = function() {
      runner.report(this.value, "");
    };

    var selectTest = function () {
      frmTest.src = "";
      var tc = runner.getTest();
      if (!tc) {
        if (runner.testIndex() === -1)
          textTest.value = "---Begin---";
        else
          textTest.value = "---End---";
        changeColor("NOTRUN");
        return;
      }
      testinfo.value = runner.testInfo();
      $(divSum).html(runner.getTestSum(false));
      textTest.value = ((tc.execution_type === "manual") ? "(M)" : "") + tc.id;
      changeColor(tc.result);
    };

    function changeColor(result) {
      if (result === "PASS")
        $(textTest).css("backgroundColor", "lightgreen");
      else if (result === "FAIL")
        $(textTest).css("backgroundColor", "tomato");
      else if (result === "BLOCK")
        $(textTest).css("backgroundColor", "yellow");
      else
        $(textTest).css("backgroundColor", "white");
    }

    return {
      bind: function (r) {
        var self = this;
        r.ui = self;
        runner = r;
        $(btnPass).on("click", selectResult);
        $(btnFail).on("click", selectResult);
        $(btnBlock).on("click", selectResult);
        $(btnNext).on("click", nextTest);
        $(btnPrev).on("click", prevTest);
        $(btnRun).on("click",  function () {
          if (VIEWFLAGS.has("list")) {
            runner.options.auto_testsuites = [];
            var tdoc = frmTest.contentWindow.document;
            $(tdoc).find("section li>input:checked").each(function () {
              var tname = $(this).attr("id");
              runner.options.auto_testsuites.push(tname);
            });
            self.list();
          } else if (VIEWFLAGS.has("suite")) {
            runner.runAll();
          } else
            self.runTest(runner.getTestCaseUrl());
        });
        $(frmTest).on("load",  function () {runner.loadReady();});
        $(btnExit).on("click", function () {
          runner.submitResult();
          if (runner.options.multiplex && VIEWFLAGS.has("suite"))
            self.list();
          else
            close_window();
        });
        $(btnBack).on("click", function () {
          frmTest.src = "";
          setTimeout(function () {self.browse();}, 300);
        });
        $(btnSave).on("click", function () {
          runner.submitResult();
          runner.options.notifyInfo = "*Save succeed*";
          $(divSum).html(runner.getTestSum(true));
        });
        frmTest.height = $(window).height();
      },

      list: function () {
        var tdoc = frmTest.contentWindow.document;
        $(btnExit).attr("value", "Exit");
        tdoc.open("text/html", "replace");
        tdoc.writeln(runner.getListInfo());
        var self = this;
        $(tdoc).find("section li>a").on("click", function (e) {
          runner.options.testsuite_name = $(this).text();
          VIEWFLAGS.del("list");
          runner.start();
          window.scrollTo(0, 0);
          e.preventDefault();
        });
        $(tdoc).find("section h3>input[type=checkbox]").on("click", function () {
          $boxs = $(this).parent().parent().find("li>input[type=checkbox]");
          $boxs.prop('checked', $(this).is(':checked'));
        });
        $(divSum).html(runner.getListSum());
        runner.cleanTests();
        self.updateView(VIEWFLAGS.add("list"));
        if (runner.options.auto_testsuites) {
          if (runner.options.auto_testsuites.length > 0) {
            var ts = runner.options.auto_testsuites.shift();
            runner.options.testsuite_name = ts;
            runner.options.autorun = true;
            VIEWFLAGS.del("list");
            runner.start();
          } else
            runner.options.autorun = false;
        }
      },

      browse: function () {
        var tdoc = frmTest.contentWindow.document;
        if (runner.options.multiplex)
          $(btnExit).attr("value", "Back");
        tdoc.open("text/html", "replace");
        tdoc.writeln(runner.getBrowseInfo());
        var self = this;
        $(tdoc).find("section ul li>a").on("click", function (e) {
          var ind = parseInt($(this).attr("rel"));
          self.updateView(VIEWFLAGS.del("suite"));
          self.updateTest(ind);
          window.scrollTo(0, 0);
          e.preventDefault();
        });
        $(divSum).html(runner.getTestSum(true));
        self.updateView(VIEWFLAGS.add("suite"));
      },

      updateTest: function (ind) {
        if (typeof ind !== "undefined") runner.testIndex(ind);
        selectTest();
      },

      updateView: function (flags) {
        if (flags & VIEWFLAGS.flags.batch)
          $(".batchhide").hide();
        else {
          $(".batchhide").show();
          if (flags & VIEWFLAGS.flags.list) {
            $(".tchide").show();
            $(".suitehide").show();
            $(".listhide").hide();
          } else if (flags & VIEWFLAGS.flags.suite) {
            $(".listhide").show();
            $(".tchide").show();
            $(".suitehide").hide();
          } else {
            $(".listhide").show();
            $(".suitehide").show();
            $(".tchide").hide();
          }
        }
      },

        testComplete: function () {
        return runner.checkResult(frmTest.contentWindow.document);
      },

      runTest: function (uri) {
        if (uri === null) return;
        if (uri)
          frmTest.src = uri;
        else
          runner.loadReady();
      },

      updateTestInfo: function (info, sum, result) {
        if (info !== null)
          testinfo.value = info;
        if (sum !== null)
          $(divSum).html(sum);
        if (result !== null)
          changeColor(result);
      },
     };
  } ());

  function escape_html(s) {
    return s.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g,
      "&quot;").replace(/'/g, "&#39;");
  }

  function print_error(command, message) {
    console.warn("Command -" + command + ": " + message);
  }

  function close_window() {
    setTimeout(function () {
      window.open('', '_self', '');
      window.close();
      if (window.parent != window.self) {
        window.parent.onbeforeunload = null;
        window.parent.close();
      }
    }, 1000);
  }

  function pre_init() {
    var runner_ok = false;
    $.get(SERVER + "/check_server", function () {
      runner_ok = slave_runner.start(i_ui);
    });
    if (!runner_ok)
      master_runner.start(i_ui);
  }
  var SERVER = "http://127.0.0.1:8000";
  var TESTLIST_FILE = "testlist.json"
  var VIEWFLAGS = { val: 0,
    flags: {suite: 1, batch: 2, list: 4},
    add: function (f) { this.val |= this.flags[f]; return this.val},
    del: function (f) { this.val &= ~this.flags[f]; return this.val},
    has: function (f) { return this.val & this.flags[f];},
  };
  $.ajaxSetup({ async: false});
  $(window).on("ready", pre_init);
})(window);
