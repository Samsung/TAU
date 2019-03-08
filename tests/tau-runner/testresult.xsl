<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <STYLE type="text/css">
        @import "tests.css";
      </STYLE>
      <head>
        <script type="text/javascript" src="jquery.min.js"/>
      </head>
      <body>
        <div id="testcasepage">
          <div id="title">
            <table>
              <tr>
                <td>
                  <h1>Test Report</h1>
                </td>
              </tr>
            </table>
          </div>
          <div id="device">
            <table>
              <tr>
                <th colspan="2">Device Information</th>
              </tr>
              <tr>
                <td>Device Name</td>
                <td>
                  <xsl:choose>
                    <xsl:when test="test_definition/environment/@device_name">
                      <xsl:if test="test_definition/environment/@device_name = ''">
                        N/A
                      </xsl:if>
                      <xsl:value-of select="test_definition/environment/@device_name"/>
                    </xsl:when>
                    <xsl:otherwise>
                      N/A
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
              <tr>
                <td>Device Model</td>
                <td>
                  <xsl:choose>
                    <xsl:when test="test_definition/environment/@device_model">
                      <xsl:if test="test_definition/environment/@device_model = ''">
                        N/A
                      </xsl:if>
                      <xsl:value-of select="test_definition/environment/@device_model"/>
                    </xsl:when>
                    <xsl:otherwise>
                      N/A
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
              <tr>
                <td>OS Version</td>
                <td>
                  <xsl:choose>
                    <xsl:when test="test_definition/environment/@os_version">
                      <xsl:if test="test_definition/environment/@os_version = ''">
                        N/A
                      </xsl:if>
                      <xsl:value-of select="test_definition/environment/@os_version"/>
                    </xsl:when>
                    <xsl:otherwise>
                      N/A
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
              <tr>
                <td>Device ID</td>
                <td>
                  <xsl:choose>
                    <xsl:when test="test_definition/environment/@device_id">
                      <xsl:if test="test_definition/environment/@device_id = ''">
                        N/A
                      </xsl:if>
                      <xsl:value-of select="test_definition/environment/@device_id"/>
                    </xsl:when>
                    <xsl:otherwise>
                      N/A
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
              <tr>
                <td>Firmware Version</td>
                <td>
                  <xsl:choose>
                    <xsl:when test="test_definition/environment/@firmware_version">
                      <xsl:if test="test_definition/environment/@firmware_version = ''">
                        N/A
                      </xsl:if>
                      <xsl:value-of select="test_definition/environment/@firmware_version"/>
                    </xsl:when>
                    <xsl:otherwise>
                      N/A
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
              <tr>
                <td>Build ID</td>
                <td>
                  <xsl:choose>
                    <xsl:when test="test_definition/environment/@build_id">
                      <xsl:if test="test_definition/environment/@build_id = ''">
                        N/A
                      </xsl:if>
                      <xsl:value-of select="test_definition/environment/@build_id"/>
                    </xsl:when>
                    <xsl:otherwise>
                      N/A
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
              <tr>
                <td>Screen Size</td>
                <td>
                  <xsl:choose>
                    <xsl:when test="test_definition/environment/@screen_size">
                      <xsl:if test="test_definition/environment/@screen_size = ''">
                        N/A
                      </xsl:if>
                      <xsl:value-of select="test_definition/environment/@screen_size"/>
                    </xsl:when>
                    <xsl:otherwise>
                      N/A
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
              <tr>
                <td>Resolution</td>
                <td>
                  <xsl:choose>
                    <xsl:when test="test_definition/environment/@resolution">
                      <xsl:if test="test_definition/environment/@resolution = ''">
                        N/A
                      </xsl:if>
                      <xsl:value-of select="test_definition/environment/@resolution"/>
                    </xsl:when>
                    <xsl:otherwise>
                      N/A
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
              <tr>
                <td>Host Info</td>
                <td>
                  <xsl:choose>
                    <xsl:when test="test_definition/environment/@host">
                      <xsl:if test="test_definition/environment/@host = ''">
                        N/A
                      </xsl:if>
                      <xsl:value-of select="test_definition/environment/@host"/>
                    </xsl:when>
                    <xsl:otherwise>
                      N/A
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
              <tr>
                <td>CTS Version</td>
                <td>
                  <xsl:choose>
                    <xsl:when test="test_definition/environment/@cts_version">
                      <xsl:if test="test_definition/environment/@cts_version = ''">
                        N/A
                      </xsl:if>
                      <xsl:value-of select="test_definition/environment/@cts_version"/>
                    </xsl:when>
                    <xsl:otherwise>
                      N/A
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
              <tr>
                <td>Others</td>
                <td>
                  <xsl:if test="test_definition/environment/other = ''">
                    N/A
                  </xsl:if>
                  <xsl:call-template name="br-replace">
                    <xsl:with-param name="word" select="test_definition/environment/other"/>
                  </xsl:call-template>
                </td>
              </tr>
            </table>
          </div>
          <div id="summary">
            <table>
              <tr>
                <th colspan="2">Test Summary</th>
              </tr>
              <tr>
                <td>Test Plan Name</td>
                <td>
                  <xsl:value-of select="test_definition/summary/@test_plan_name"/>
                </td>
              </tr>
              <tr>
                <td>Tests Total</td>
                <td>
                  <xsl:value-of select="count(test_definition//suite/set/testcase)"/>
                </td>
              </tr>
              <tr>
                <td>Test Passed</td>
                <td>
                  <xsl:value-of select="count(test_definition//suite/set/testcase[@result = 'PASS'])"/>
                </td>
              </tr>
              <tr>
                <td>Test Failed</td>
                <td>
                  <xsl:value-of select="count(test_definition//suite/set/testcase[@result = 'FAIL'])"/>
                </td>
              </tr>
              <tr>
                <td>Test Block</td>
                <td>
                  <xsl:value-of select="count(test_definition//suite/set/testcase[@result = 'BLOCK'])"/>
                </td>
              </tr>
              <tr>
                <td>Test Not Run</td>
                <td>
                  <xsl:value-of select="count(test_definition//suite/set/testcase) - count(test_definition//suite/set/testcase[@result = 'PASS']) - count(test_definition//suite/set/testcase[@result = 'FAIL']) - count(test_definition//suite/set/testcase[@result = 'BLOCK'])"/>
                </td>
              </tr>
              <tr>
                <td>Start time</td>
                <td>
                  <xsl:value-of select="test_definition/summary/start_at"/>
                </td>
              </tr>
              <tr>
                <td>End time</td>
                <td>
                  <xsl:value-of select="test_definition/summary/end_at"/>
                </td>
              </tr>
            </table>
          </div>
          <div id="suite_summary">
            <div id="title">
              <a name="contents"/>
              <table>
                <tr>
                  <td class="title">
                    <h1>Test Summary by Suite</h1>
                  </td>
                </tr>
              </table>
            </div>
            <table>
              <tr>
                <th>Suite</th>
                <th>Passed</th>
                <th>Failed</th>
                <th>Blocked</th>
                <th>Not Run</th>
                <th>Total</th>
              </tr>
              <xsl:for-each select="test_definition/suite">
                <xsl:sort select="@name"/>
                <tr>
                  <td>
                    <a>
                      <xsl:attribute name="href">
                        #<xsl:value-of select="@name"/>
                      </xsl:attribute>
                      <xsl:value-of select="@name"/>
                    </a>
                  </td>
                  <td>
                    <xsl:value-of select="count(set//testcase[@result = 'PASS'])"/>
                  </td>
                  <td>
                    <xsl:value-of select="count(set//testcase[@result = 'FAIL'])"/>
                  </td>
                  <td>
                    <xsl:value-of select="count(set//testcase[@result = 'BLOCK'])"/>
                  </td>
                  <td>
                    <xsl:value-of select="count(set//testcase) - count(set//testcase[@result = 'PASS']) - count(set//testcase[@result = 'FAIL']) - count(set//testcase[@result = 'BLOCK'])"/>
                  </td>
                  <td>
                    <xsl:value-of select="count(set//testcase)"/>
                  </td>
                </tr>
              </xsl:for-each>
            </table>
          </div>
          <div id="fail_cases">
            <div id="title">
              <table>
                <tr>
                  <td class="title">
                    <h1 align="center">
                      Test Failures (
                        <xsl:value-of select="count(test_definition/suite/set//testcase[@result = 'FAIL'])"/>
                      )
                    </h1>
                  </td>
                </tr>
              </table>
            </div>
            <xsl:for-each select="test_definition/suite">
              <xsl:sort select="@name"/>
              <div id="btc">
                <a href="#contents">Back to Contents</a>
              </div>
              <div id="suite_title">
                Test Suite:
                <xsl:value-of select="@name"/>
                <a><xsl:attribute name="name"><xsl:value-of select="@name"/></xsl:attribute></a>
              </div>
              <table>
                <tr>
                  <th>Case_ID</th>
                  <th>Purpose</th>
                  <th>Result</th>
                  <th>Stdout</th>
                </tr>
                <xsl:for-each select=".//set">
                  <xsl:sort select="@name"/>
                  <tr>
                    <td colspan="4">
                      Test Set:
                      <xsl:value-of select="@name"/>
                    </td>
                  </tr>
                  <xsl:for-each select=".//testcase">
                    <xsl:sort select="@id"/>
                    <xsl:choose>
                      <xsl:when test="@result">
                        <xsl:if test="@result = 'FAIL'">
                          <tr>
                            <td>
                              <xsl:value-of select="@id"/>
                            </td>
                            <td>
                              <xsl:value-of select="@purpose"/>
                            </td>
                            <td class="red_rate">
                              <xsl:value-of select="@result"/>
                            </td>
                            <td>
                              <xsl:value-of select=".//result_info/stdout"/>
                              <xsl:if test=".//result_info/stdout = ''">
                                N/A
                              </xsl:if>
                            </td>
                          </tr>
                        </xsl:if>
                      </xsl:when>
                    </xsl:choose>
                  </xsl:for-each>
                </xsl:for-each>
              </table>
            </xsl:for-each>
          </div>
          <div id="cases">
            <div id="title">
              <table>
                <tr>
                  <td class="title">
                    <h1 align="center">Detailed Test Results</h1>
                  </td>
                </tr>
              </table>
            </div>
            <xsl:for-each select="test_definition/suite">
              <xsl:sort select="@name"/>
              <div id="btc">
                <a href="#contents">Back to Contents</a>
              </div>
              <div id="suite_title">
                Test Suite:
                <xsl:value-of select="@name"/>
                <a><xsl:attribute name="name"><xsl:value-of select="@name"/></xsl:attribute></a>
              </div>
              <table>
                <tr>
                  <th>Case_ID</th>
                  <th>Purpose</th>
                  <th>Result</th>
                  <th>Stdout</th>
                </tr>
                <xsl:for-each select=".//set">
                  <xsl:sort select="@name"/>
                  <tr>
                    <td colspan="4">
                      Test Set:
                      <xsl:value-of select="@name"/>
                    </td>
                  </tr>
                  <xsl:for-each select=".//testcase">
                    <xsl:sort select="@id"/>
                    <tr>
                      <td>
                        <xsl:value-of select="@id"/>
                      </td>
                      <td>
                        <xsl:value-of select="@purpose"/>
                      </td>
                      <xsl:choose>
                        <xsl:when test="@result">
                          <xsl:if test="@result = 'FAIL'">
                            <td class="red_rate">
                              <xsl:value-of select="@result"/>
                            </td>
                          </xsl:if>
                          <xsl:if test="@result = 'PASS'">
                            <td class="green_rate">
                              <xsl:value-of select="@result"/>
                            </td>
                          </xsl:if>
                          <xsl:if test="@result = 'BLOCK' ">
                            <td>
                              BLOCK
                            </td>
                          </xsl:if>
                          <xsl:if test="@result != 'BLOCK' and @result != 'FAIL' and @result != 'PASS' ">
                            <td>
                              Not Run
                            </td>
                          </xsl:if>
                        </xsl:when>
                        <xsl:otherwise>
                          <td>
                          </td>
                        </xsl:otherwise>
                      </xsl:choose>
                      <td>
                        <xsl:value-of select=".//result_info/stdout"/>
                        <xsl:if test=".//result_info/stdout = ''">
                          N/A
                        </xsl:if>
                      </td>
                    </tr>
                  </xsl:for-each>
                </xsl:for-each>
              </table>
            </xsl:for-each>
          </div>
        </div>
        <div id="goTopBtn">
          <img border="0" src="./back_top.png"/>
        </div>
        <script type="text/javascript" src="application.js"/>
        <script language="javascript" type="text/javascript">
          $(document).ready(function(){
            goTopEx();
          });
        </script>
      </body>
    </html>
  </xsl:template>
  <xsl:template name="br-replace">
    <xsl:param name="word"/>
    <xsl:variable name="cr">
      <xsl:text>
      </xsl:text>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="contains($word,$cr)">
        <xsl:value-of select="substring-before($word,$cr)"/>
        <br/>
        <xsl:call-template name="br-replace">
          <xsl:with-param name="word" select="substring-after($word,$cr)"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$word"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>
