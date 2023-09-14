sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
    /**
     * @param {sap.ui.core.mvc.Controller} Controller
     * @param {sap.ui.model.json.JSONModel} JSONModel
     * @param {sap.ui.core.Fragment} Fragment
     * @param {sap.m.MessageBox} MessageBox
     */
    function (Controller, JSONModel, Fragment,MessageBox) {
        "use strict";

        return Controller.extend("test.crud.controller.View1", {
            onInit: function () {
                // "sap/ui/model/json/JSONModel"
                // 생성 시 사용할 Model 데이터
                var oData = {
                    carrier: {
                        Carrid: "",
                        Carrname: "",
                        Currcode: "",
                        Url: ""
                    }
                };

                var oModel = new JSONModel( oData );
                var oView  = this.getView();
                oView.setModel(oModel,"new");

                var oModel = new JSONModel( oData );
                oView.setModel(oModel,"edit");            },

            onCreate : function () {

                // new 모델의 데이터 초기화
                var oView = this.getView();
                var oModel = oView.getModel("new");
                oModel.setProperty("/carrier/Carrid", "");
                oModel.setProperty("/carrier/Carrname", "");
                oModel.setProperty("/carrier/Currcode", "");
                oModel.setProperty("/carrier/Url", "");

                // 팝업창 호출
                this._openDialog("idNewDialog", "test.crud.view.New");
            },

            _openDialog : function ( sId, sName ){
                var oView = this.getView();
                var oDialog = oView.byId(sId);

                if ( oDialog ) {
                    // 이미 해당 다이얼로그가 로드되어 있다면,
                    oDialog.open(); // 다시 읽어오지 않고 바로 open
                } else {
                    // 해당 다이얼로그가 화면에 로드되어 있지 않은 경우
                    // "sap/ui/core/Fragment"
                    Fragment.load({
                        id: oView.getId(),
                        name: sName,
                        controller: this
                    }).then(function( oDialog ) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                }
            },
            onCloseDialog : function () {
                this.byId("idNewDialog").close();
            },
            onCloseDialogEdit : function () {
                this.byId("idEditDialog").close();
            },

            
            onSave : function () {
                var oModel = this.getView().getModel();
                var oNewModel = this.getView().getModel("new");

                var oInputData = oNewModel.getData();

                var that = this; // 파일 내에서 성공했는지 아는 것이 아니라 전역변수로 선언해줌 

                oModel.create(
                    "/CarrierSet",
                {
                    Carrid   : oInputData.carrier.Carrid,
                    Carrname : oInputData.carrier.Carrname,
                    Currcode : oInputData.carrier.Currcode,
                    Url      : oInputData.carrier.Url
                },
                {
                    success : function ( oData, oResponse ){
                        MessageBox.success("신규 항공사" + oData.Carrid + "가 생성되었습니다.");
                        // UX400 p.329
                        // oModel.setRefreshAfterChange(false);
                        // oModel.refresh();   
                        that.onCloseDialog();
                    },
                    error : function ( oError ) {     
                        MessageBox.error("생성실패:" + oError.responseText);                                                            
                    }
                }
            );
            },
            onDelete : function () {
                var oTable = this.byId("idTable");
                var oItems = oTable.getSelectedItems();

                if ( !oItems || oItems.length === 0 ){
                    // 이 경우 사용자가 한 줄도 선택하지 않고 [삭제] 버튼을 눌렀을 때
                    MessageBox.information("라인을 먼저 선택하세요.");
                    return; // onDelete 를 그만 중단한다.
                }

                // 이 문장부터는 oItems 에 데이터가 있는 경우를 의미한다.

                // oData Model 을 가져와 Delete 명령을 보낸다.
                var oModel = this.getView().getModel();

                var nSuccessCounter =0;
                for (var i=0 ; i < oItems.length ; i ++ ) {
                    oItems.forEach( function ( oItem ) {
                        // 선택된 각 라인별 엔티티 경로를 가져와서
                        var oItem = oItems[i];
                        var path = oItem.getBindingContext().getPath();
    
                        // 해당 경로의 엔티티를 삭제하도록 요청한다.
                        oModel.remove(path, {
                            success: function( oData,oResponse ) {
                                // 요청된 결과가 성공적으로 진행되었을 때    
                                // MessageBox.success("");
                                nSuccessCounter ++ ;
                                if (nSuccessCounter === i) [
                                    // 마지막에만 딱 한번 성공메시지를 출력한다.
                                    MessageBox.success("삭제가 완료되었습니다.")
                                ]
                            },
                            error: function( oError ){
                                // 요청된 내용이 오류로 이어졌을 때
                                MessageBox.error("삭제실패:" + oError.responseText);
                            }
                    
                        });
                        });
                    }
                },
            onOpenDialogEdit : function (oEvent) {

                // 이벤트가 발생한 출처
                var oSource = oEvent.getSource();

                // 출처의 연결된 데이터
                var oContext = oSource.getBindingContext();

                // 그 데이터의 속성값 조회
                var carrid   = oContext.getProperty("Carrid");
                var carrname = oContext.getProperty("Carrname");
                var currcode = oContext.getProperty("Currcode");
                var url      = oContext.getProperty("Url");

                var oEditModel = this.getView().getModel("edit");
                oEditModel.setData({
                    carrier: {
                        Carrid : carrid,
                        Carrname : carrname,
                        Currcode : currcode,
                        Url : url
                    }
                });
                
                // 팝업창 호출
                this._openDialog("idEditDialog", "test.crud.view.Edit");
            },
            onEditComplete: function(){
                var oView = this.getView();

                var oEditModel = oView.getModel("edit");
                var sCarrier = oEditModel.getData().carrier;
                
                var oModel = oView.getModel();
                oModel.update(
                    // 경로 ex) /CarrierSet('AA')
                    "/CarrierSet('" + sCarrier.Carrid + "')",
                    // 그 경로에 대한 데이터가 어떻게 변경했으면 좋을지 데이터를 전달
                    sCarrier,
                    {
                        success: function(){
                            MessageBox.success("항공사"+sCarrier.Carrid + "가 성공적으로 수정되었습니다.");
                        },
                        error: function(){
                            MessageBox.error(oError.message);
                        }
                    }
                )
            }
        });
    });                                                                                                                             