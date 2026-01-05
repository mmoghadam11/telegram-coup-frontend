import React, { ReactElement } from "react";
// ما از این پکیج برای ساختن رابط کاربری کامل استفاده می‌کنیم
// Import the main component
import { LocalizationMap, TextDirection, Viewer } from "@react-pdf-viewer/core";
import { Worker } from "@react-pdf-viewer/core";

// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin, ToolbarProps, ToolbarSlot } from "@react-pdf-viewer/default-layout";
// Import styles
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import pr_FR from "@react-pdf-viewer/locales/lib/pr_FR.json";
import { useTheme } from "@mui/material/styles";

interface PDFProps {
  PdfUrl?: string;
  sx?:any
}
// function MyPdfViewer() {
const MyPdfViewer: React.FC<PDFProps> = ({ PdfUrl,sx }) => {
    const muiTheme = useTheme();
  // آدرس فایل PDF شما
  const samplePdfUrl = "/assets/PDF/test.pdf";
  const renderToolbar = (Toolbar: (props: ToolbarProps) => ReactElement) => (
    <Toolbar>
        {(slots: ToolbarSlot) => {
            const {
                CurrentPageInput,
                Download,
                DownloadMenuItem,
                EnterFullScreen,
                EnterFullScreenMenuItem,
                GoToNextPage,
                GoToNextPageMenuItem,
                GoToPreviousPage,
                NumberOfPages,
                Print,
                PrintMenuItem,
                ShowSearchPopover,
                Zoom,
                ZoomIn,
                ZoomOut,
            } = slots;
            return (
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                        textAlign:"center"
                    }}
                >
                    {/* <div style={{ padding: '0px 2px' }}>
                        <ShowSearchPopover />
                    </div> */}
                    <div style={{ padding: '0px 2px',marginRight:"25px" }}>
                        <ZoomOut />
                    </div>
                    <div style={{ padding: '0px 2px' }}>
                        <Zoom />
                    </div>
                    <div style={{ padding: '0px 2px' }}>
                        <ZoomIn />
                    </div>
                    <div style={{ padding: '0px 2px', marginRight: 'auto' }}>
                        {/* <EnterFullScreen /> */}
                        <EnterFullScreenMenuItem onClick={()=>{}}/>
                    </div>
                    <div style={{ padding: '0px 2px' }}>
                        <GoToPreviousPage />
                    </div>
                    <div style={{ padding: '0px 2px', display:"flex",textAlign:"center",alignItems:"center"}}>
                        <CurrentPageInput /> / <NumberOfPages />
                    </div>
                    <div style={{ padding: '0px 2px',marginLeft:"auto"}}>
                        <GoToNextPage />
                        {/* <GoToNextPageMenuItem onClick={()=>{}} /> */}
                    </div>
                    {/* <div style={{ padding: '0px 2px' }}>
                        <Download />
                    </div> */}
                    <div style={{ padding: '0px 2px' }}>
                        <DownloadMenuItem onClick={()=>{}} />
                    </div>
                    <div style={{ padding: '0px 2px' }}>
                        {/* <Print /> */}
                        <PrintMenuItem onClick={()=>{}}/>
                    </div>
                </div>
            );
        }}
    </Toolbar>
);
// ساخت یک نمونه از پلاگین Default Layout
  const defaultLayoutPluginInstance = defaultLayoutPlugin({renderToolbar,sidebarTabs: (defaultTabs) => [],});
  return (
    <div style={{ height: "66vh", width: "90%", margin: "20px auto" ,direction:"rtl",...sx}}>
      {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"> */}
      <Worker workerUrl="/worker.js">
        <Viewer
          theme={{
            direction: TextDirection.RightToLeft,
            theme: muiTheme.palette.mode
          }}
        //   localization={pr_FR as unknown as LocalizationMap}
          fileUrl={PdfUrl ?? samplePdfUrl}
          plugins={[
            // پلاگین رابط کاربری رو به Viewer اضافه می‌کنیم
            defaultLayoutPluginInstance,
            
          ]}
        />
      </Worker>
    </div>
  );
};

export default MyPdfViewer;
