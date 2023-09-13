sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {sap.m.MessageBox} MessageBox
     * @param {sap.ui.model.json.JSONModel} JSONModel
     * @param {sap.ui.core.Fragment} Fragment
     */
    function (Controller,
	MessageBox,
	JSONModel,
    Fragment) {
        "use strict";

        return Controller.extend("sync.c20.test.ui.table.58.controller.View1", {
            oBusyIndicator: null,
            onInit: function () {
                // 화면이 전부 그려지기 전에 onInit이 호출됨
                var oRouter = this.getOwnerComponent().getRouter();

                // getRoute(Mainfest.json 의 경로이름)
                oRouter.getRoute("RouteView1").attachMatched(this._onRouterMatched,this);

                var oTable = this.byId("idCarrierTable");
                
                this.oBusyIndicator = oTable.getNoData();

                var oData = {
                    edit : false,
                    currency : [
                        {key:'KRW'},
                        {key:'USD'},
                        {key:'JPY'},
                        {key:'EUR'},
                        {key:'CNY'},
                    ]
                };
                
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "view");
            },

        _onRouterMatched : function ( oEvent ) {

            // onInit 에서는 테이블의 바인딩 정보가 없으므로,
            // 라우터의 경로가 일치할 때 이 메소드가 호출되도록 로직을 추가함
            // 이 메소드가 호출되는 시점은 화면이 전부 로드가 끝난 뒤 이므로,
            // 테이블의 바인딩 정보를 가져올 수 있다.

            // 가져온 바인딩 정보를 이용하여 화면에 데이터를 새로고침 시켜 No Data 현상을 방지한다.
            // List Binding 정보를 가져온다.

            var oTable = this.byId("idCarrierTable");
            var oBinding = oTable.getBinding("rows");

            // 데이터를 요청했을 때 로직 - 로딩 과정을 보여주기 위한 작업
            oBinding.attachDataRequested(function () {
                oTable.setNoData(this.oBusyIndicator);
            });

            // 데이터를 전달받았을 때 로직 - 로딩 과정을 중단한다.
            oBinding.attachDataReceived(function () {
                oTable.setNoData(null);
            });

            // 연결된 OData Service에서 데이터를 새로고침
            oBinding.refresh();     
        },
        onModelRefresh : function () {
            this.byId("idCarrierTable").getBinding().refresh(true);
        },
        onDelete : function() {

            var oView = this.getView();
            var oModel = oView.getModel();

            // sap.ui.table.Table 의 ID를 전달해서 해당 객체를 oTable에 저장한다.
            // oTable에 담긴 정보를 이용해서 선택된 항목들을 찾고,
            // 선택된 항목들만 삭제되도록 이 메소드에서 구현한다.
            var oTable = this.byId("idCarrierTable");

            // 선택된 라인들의 번호
            var aIndex = oTable.getSelectedIndices();

            // i는 0부터 1씩 증가하여 최대 aIndex의 길이보다 작을 때까지 반복한다.
            // aIndex에 10줄이 있는 경우 i는 9가 될 때까지 반복한다.
            // 9까지 반복하는 경우 0부터 시작하므로 총 10번 반복하는 경우라 할 수 있다.
            var nSuccessCounter = 0;
            for ( var i=0; i<aIndex.length ; i++ ){
                var oContext = oTable.getContextByIndex(aIndex[i]);
                var sPath = oContext.getPath();
                oModel.remove(
                    sPath,
                    {
                        success: function(){
                            nSuccessCounter++;
                            if ( nSuccessCounter === i ){
                                MessageBox.success("데이터가 삭제되었습니다.");
                                oTable.clearSelection();
                            }
                        },
                        error: function(){
                            MessageBox.error("삭제실패:" + oError.responseText );
                        }
                    }
                )
            }
        },
        onOpenDialogNew : function (){
            var oData = {
                carrier: {
                    Carrid : "",
                    Carrname : "",
                    Currcode : "",
                    Url : ""
                }
            }

            var oModel = new JSONModel(oData);
            var oView = this.getView();
            this.getView().setModel(oModel, "new");

            var oDialog = this.byId("idNewDialog");
            if ( oDialog ){
                oDialog.open();
            } else {
                var loadData = {
                    id: oView.getId(),
                    name: "sync.c20.test.ui.table.58.view.New",
                    controller: this
                };

                Fragment.load( loadData ).then(function ( oDialog ) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            }
        },
        onCloseDialog : function ( oEvent ) {
            var oDialog = oEvent.getSource().getParent();
            oDialog.close();
        },
        onSave : function () {
                var oView = this.getView();

                // new 모델
                var oNewModel = oView.getModel("new");
                var sCarrier = oNewModel.getData().carrier;
            
                // 기본 모델
                var oModel = oView.getModel();
                oModel.create(
                    "/CarrierSet",
                    sCarrier,
                    {
                        success : function ( oData, oResponse ){
                            MessageBox.success("항공사" + oData.Carrid + "가 생성되었습니다.");
                            oView.byId("idNewDialog").close();

                        },
                        error : function ( oError ){
                            MessageBox.error("생성실패"+ oError.responseText );
                        }
                }
            )
        },
        onChangeMode: function() {
            var oModel = this.getView().getModel("view")
            var oData  = oModel.getData();
            
            if ( oData.edit ) {
                oData.edit = false;
            } else {
                oData.edit = true;
            }
            oModel.setData(oData);

            // OData 의 Original Data 로 원복한다.
            // Original Data는 SAP 서버에서 가져온 원 데이터
            this.getView().getModel().resetChanges();

            // this.getView().setModel(oModel,"view");
        },
        onUpdate: function() {

            var that = this; // 콜백함수므로, that으로 받아온다.

            var oView = this.getView();
            // SAP Gateway 로 Update 하기 위한 OData Model
            var oModel = oView.getModel();

            var oTable = this.byId("idCarrierTable");

            // 선택된 라인정보를 가져와 해당 라인들에
            // 변경사항을 서버로 전송한다.
            var aIndex = oTable.getSelectedIndices();

            aIndex.forEach(function(vIndex, number, array){
                // vIndex 숫자에 해당되는 행번호의 데이터를 가져온다.
                var oContext = oTable.getContextByIndex(vIndex);
                // s = string 
                var sPath = oContext.getPath();

                oModel.update(sPath, 
                {
                    Carrid: oContext.getProperty("Carrid"),
                    Carrname: oContext.getProperty("Carrname"),
                    Currcode: oContext.getProperty("Currcode"),
                    Url: oContext.getProperty("Url")
                },
                {
                    success : function( oData, oResponse ) {
                        if( number + 1 === array.length ) {
                            MessageBox.success(
                                array.length + "건이 수정되었습니다");
                                // 선택된 라인 해제
                                oTable.clearSelection();

                                // view 모델의 /edit 의 값에 따라 수정모드/조회모드로 관리된다.
                                // /edit = true 면 수정모드, false 면 조회
                                that.onChangeMode();
                        }
                    },
                    error: function( oError ){
                        MessageBox.error("수정실패:"+oError.responseText);

                    }
                });
            });
        }
        });
    });
