/**
 *  Written by Alexandr Climov
 */

using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections.Specialized;
using System.IO;
using System.Xml;


    public partial class BrowserCheck : System.Web.UI.Page
    {
        private const string Design = "design";
        private const string Browser = "browser";
        private const string Checked = "checked";
        private const string Reset = "reset";

        private NameValueCollection QueryString;
        private bool isDesignNew = false;
        private bool xmlHasChanged = false;
        private string Output = string.Empty;

        protected void Page_Load(object sender, EventArgs e)
        {
            Response.ContentType = "text/xml";

            QueryString = Request.QueryString;

            if (QueryString.Count > 0 && QueryString.AllKeys.Contains(Design))
            {
                LoadXml();
            }
        }

        private void LoadXml()
        {

            XmlDocument xml = new XmlDocument();
            xml.Load(Server.MapPath("browsercheck.xml"));

            XmlNode design = GetDesign(xml);

            if (QueryString.AllKeys.Contains(Browser) &&
                QueryString.AllKeys.Contains(Checked))
            {
                UpdateBrowserCheck(design, xml);
            }

            if (QueryString.AllKeys.Contains(Reset) &&
                QueryString[Reset].ToLower() == "true")
            {
                ResetDesign(design);
            }

            xml.Save(Server.MapPath("browsercheck.xml"));

            SetOuput(design);
        }

        private void SetOuput(XmlNode design)
        {
            if (isDesignNew)
            {
                Output = string.Concat(newDesignPrefix,
                                        design.OuterXml,
                                        newDesignPostfix);
            }
            else if (xmlHasChanged)
            {
                Output = "<browsercheck>" +
            "<edit success=\"true\" />" +
                "</browsercheck>";
            }
        }

        //Retrieve desgin node from XML  or create new one
        private XmlNode GetDesign(XmlDocument xml)
        {
            XmlNode design = xml.SelectSingleNode(string.Format("//design[@id='{0}']", QueryString[Design]));
            if (design == null)
            {
                var designRoot = xml.SelectSingleNode("//designs");

                XmlAttribute designattr;
                XmlElement checkedelmt;
                //Create child with ID attribute
                design = xml.CreateElement("design");
                designattr = xml.CreateAttribute("id");
                checkedelmt = xml.CreateElement("checked");
                designattr.Value = QueryString[Design];
                design.Attributes.Append(designattr);
                design.AppendChild(checkedelmt);
                designRoot.AppendChild(design);

                isDesignNew = true;
            }

            return design;
        }

        //Check or Uncheck browser for  design id
        private void UpdateBrowserCheck(XmlNode design, XmlDocument xml)
        {
            XmlNode browser = design.SelectSingleNode(string.Format(".//{0}", QueryString[Browser]));
            if (QueryString[Checked].ToLower() == "true")
            {
                if (browser == null)
                {
                    design.ChildNodes[0].AppendChild(xml.CreateElement(QueryString[Browser]));                    
                }
            }
            else if (QueryString[Checked].ToLower() == "false")
            {
                if (browser != null)
                {
                    design.ChildNodes[0].RemoveChild(browser);                 
                }
            }

            xmlHasChanged = true;
        }

        private void ResetDesign(XmlNode design)
        {
            design.ChildNodes[0].RemoveAll();
            xmlHasChanged = true;
        }

        protected override void Render(HtmlTextWriter writer)
        {
            writer.Write(Output);
        }

        private const string newDesignPrefix = "<browsercheck>" +
            "<browsers>" +
            "	<ie7 />" +
            "	<ie8 />" +
            "	<ie9 />" +
            "	<firefox3.5 />" +
            "	<firefox4 />" +
            "	<chrome10 />" +
            "</browsers>" +
            "<designs>";
        private const string newDesignPostfix = "</designs>" +
        "</browsercheck>";
    }

