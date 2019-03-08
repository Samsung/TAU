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
                  <h1>Test Cases</h1>
                </td>
              </tr>
            </table>
          </div>
          <div id="suites">
            <a name="contents"/>
            <table>
              <tr>
                <th>Test Suite</th>
                <th>Total</th>
                <th>Auto</th>
                <th>Manual</th>
              </tr>
              <tr>
                <td>
                  Total
                </td>
                <td>
                  <xsl:value-of select="count(test_definition/suite/set//testcase)"/>
                </td>
                <td>
                  <xsl:value-of select="count(test_definition/suite/set//testcase[@execution_type = 'auto'])"/>
                </td>
                <td>
                  <xsl:value-of select="count(test_definition/suite/set//testcase[@execution_type != 'auto'])"/>
                </td>
              </tr>
              <xsl:for-each select="test_definition/suite">
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
                    <xsl:value-of select="count(set//testcase)"/>
                  </td>
                  <td>
                    <xsl:value-of select="count(set/testcase[@execution_type = 'auto'])"/>
                  </td>
                  <td>
                    <xsl:value-of select="count(set/testcase[@execution_type != 'auto'])"/>
                  </td>
                </tr>
              </xsl:for-each>
            </table>
          </div>
          <div id="title">
            <table>
              <tr>
                <td class="title">
                  <h1>Detailed Test Cases</h1>
                </td>
              </tr>
            </table>
          </div>
          <div id="cases">
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
                  <th>Type</th>
                  <th>Component</th>
                  <th>Execution Type</th>
                  <th>Description</th>
                  <th>Specification</th>
                </tr>
                <xsl:for-each select=".//set">
                  <xsl:sort select="@name"/>
                  <tr>
                    <td colspan="7">
                      Test Set:
                      <xsl:value-of select="@name"/>
                    </td>
                  </tr>
                  <xsl:for-each select=".//testcase">
                    <!-- xsl:sort select="@id" /> -->
                    <tr>
                      <td>
                        <xsl:value-of select="@id"/>
                      </td>
                      <td>
                        <xsl:value-of select="@purpose"/>
                      </td>
                      <td>
                        <xsl:value-of select="@type"/>
                      </td>
                      <td>
                        <xsl:value-of select="@component"/>
                      </td>
                      <td>
                        <xsl:value-of select="@execution_type"/>
                      </td>
                      <td>
                        <p>
                          Pre_condition:
                          <xsl:value-of select=".//description/pre_condition"/>
                        </p>
                        <p>
                          Post_condition:
                          <xsl:value-of select=".//description/post_condition"/>
                        </p>
                        <p>
                          Test Script Entry:
                          <xsl:value-of select=".//description/test_script_entry"/>
                        </p>
                        <p>
                          Steps:
                          <p/>
                          <xsl:for-each select=".//description/steps/step"><xsl:sort select="@order"/>
                            Step
                            <xsl:value-of select="@order"/>
                            :
                            <xsl:value-of select="./step_desc"/>
                            ;
                            <p/>
                            Expected Result:
                            <xsl:value-of select="./expected"/>
                            <p/>
                          </xsl:for-each>
                        </p>
                      </td>
                      <td>
                        <xsl:for-each select=".//specs/spec"><b>[Spec_Assertion]:</b><br/>
                          [Category]:
                          <xsl:value-of select="./spec_assertion/@category"/>
                          <br/>
                          [Section]:
                          <xsl:value-of select="./spec_assertion/@section"/>
                          <br/>
                          [Specification]:
                          <xsl:value-of select="./spec_assertion/@specification"/>
                          <br/>
                          [Interface]:
                          <xsl:value-of select="./spec_assertion/@interface"/>
                          <br/>
                          <xsl:choose><xsl:when test="./spec_assertion/@element_name">
                              [<xsl:value-of select="./spec_assertion/@element_type"/>]:
                              <xsl:value-of select="./spec_assertion/@element_name"/>
                              <br/>
                            </xsl:when></xsl:choose>
                          [URL]:
                          <xsl:value-of select="./spec_url"/>
                          <br/>
                          [Statement]:
                          <xsl:value-of select="./spec_statement"/>
                          <br/>
                        </xsl:for-each>
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
</xsl:stylesheet>
