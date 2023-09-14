sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("sync.c20.test.student.controller.View1", {
            onInit: function () {
                var oData = {
                    info: {
                        Stdno : "",
                        Name : "",
                        Gender : ""
                    }
                };
                var oModel = new JSONModel(oData);
                var oView = this.getView();
                oView.setModel(oModel, "new");
            },

            onModelRefresh: function (){
                var oModel = this.getView().getModel();
                oModel.refresh();
            },

            onCreate: function (){
                var oView = this.getView();
                var oNewModel = oView.getModel("new");
                var oData = oNewModel.getProperty("/info");

                //성별을 가진 라디오 버튼이 남/여 중 어느것을 선택했는지?
                var index = oView.byId("idRBG").getSelectedIndex();
                if (index === 0){
                    //남자를 선택
                    oData.Gender = '남';
                }else {
                    //여자를 선택
                    oData.Gender = '여';
                }

                var oModel = oView.getModel();
                //SAP로 생성 요청을 보냄
                oModel.create("/StudentSet",oData,{
                    success: function (oData, oResponseText){
                        MessageBox.success("생성완료");
                    },
                    error : function (oError){
                        sap.m.MessageBox.error("생성실패" + oError.message,{
                            detail: oError.responseText
                        });
                    }
                });
            },
            onDelete : function() {
                // alert('ㅇㅇ');
                var oView = this.getView();
                var oModel = oView.getModel();
                
                var oTable = this.byId("idTable");
                var oItems = oTable.getSelectedIndices();

                var aIndex = oTable.getSelectedIndices();

                if ( !oItems || oItems.length === 0 ){
                    // 이 경우 사용자가 한 줄도 선택하지 않고 [삭제] 버튼을 눌렀을 때
                    MessageBox.information("라인을 먼저 선택하세요.");
                    return; // onDelete 를 그만 중단한다.
                }

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
                                error: function( oError ){
                                    MessageBox.error("삭제실패:" + oError.responseText );
                            }
                        })
                } 
            }
        });
    });