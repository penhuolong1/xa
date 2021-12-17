<template>
  <!-- 常用工具 -->
  <div class="content-common-tools">
    <div class="top">
      <div class="box">
        <div class="box-left">
          <div class="subtitle-name">解纷指南</div>
          <div class="notes">快速了解纠纷程序，迅速解决纠纷</div>
        </div>
        <img class="Img1" src="../../../assets/images/login-home/UnDisputeResolutionGuide.png">
      </div>
      <div class="box">
        <div class="box-left">
          <div class="subtitle-name">填表指南</div>
          <div class="notes">快速了解填表流程，解决填表困扰</div>
        </div>
        <img class="Img2" src="../../../assets/images/login-home/UnGuidanceforFillingoutForm.png">
      </div>
      <div class="box">
        <div class="box-left">
          <div class="subtitle-name">诉状辅助生成器</div>
          <div class="notes">快速了解纠纷程序，迅速解决纠纷</div>
        </div>
        <img class="Img3" src="../../../assets/images/login-home/UnLitigationAssistantGenerator.png">
      </div>
      <div class="box">
        <div class="box-left">
          <div class="subtitle-name">费用计算器</div>
          <div class="notes">快速了解填表流程，解决填表困扰</div>
        </div>
        <img class="Img4" src="../../../assets/images/login-home/UnFeeCalculator.png">
      </div>
    </div>
    <div class="top">
      <div class="box" @click="toPath">
        <div class="box-left">
          <div class="subtitle-name">诉讼风险评估</div>
          <div class="notes">快速了解纠纷程序，迅速解决纠纷</div>
        </div>
        <img class="Img5" src="../../../assets/images/login-home/UnLitigationRiskAssessment.png">
      </div>
      <div class="box" @click="toPath3">
        <div class="box-left">
          <div class="subtitle-name">案例查询</div>
          <div class="notes">快速了解填表流程，解决填表困扰</div>
        </div>
        <img class="Img6" src="../../../assets/images/login-home/UnCaseInquiry.png">
      </div>
      <div class="box" @click="toPath4">
        <div class="box-left">
          <div class="subtitle-name">法律法规</div>
          <div class="notes">快速了解纠纷程序，迅速解决纠纷</div>
        </div>
        <img class="Img7" src="../../../assets/images/login-home/UnLawsRegulations.png">
      </div>
      <div
        class="box"
        style="display: flex; justify-content: center; align-items: center"
      >
        <div class="center">敬请期待</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // 诉讼风险评估
    toPath() {
      window.open('http://wxfxpg.susong51.com:7080/ssfxpg-web/web/index?fybh=1698')
    },
    // 案例查询
    toPath3() {
      window.open('https://www.chinacourt.org/article/subjectdetail/id/MzAwNEiqNIABAA%3D%3D.shtml')
    },
    // 法律法规
    toPath4() {
      window.open('https://www.chinacourt.org/law.shtml')
    }
  }
}
</script>

<style lang="less" scoped>
//常用工具
.content-common-tools {
  width: 80%;
  margin: 0 auto 60px;
  .top {
    width: 100%;
    display: inline-flex;
    .box:hover{
      cursor: pointer;
      box-shadow: 0px 0px 20px 0px rgba(29, 49, 117, 0.1);
      .Img1 {
        content: url(../../../assets/images/login-home/DisputeResolutionGuide.png);
      }
      .Img2 {
        content: url(../../../assets/images/login-home/GuidanceforFillingoutForm.png);
      }
      .Img3 {
        content: url(../../../assets/images/login-home/LitigationAssistantGenerator.png);
      }
      .Img4 {
        content: url(../../../assets/images/login-home/FeeCalculator.png);
      }
      .Img5 {
        content: url(../../../assets/images/login-home/LitigationRiskAssessment.png);
      }
      .Img6 {
        content: url(../../../assets/images/login-home/CaseInquiry.png);
      }
      .Img7 {
        content: url(../../../assets/images/login-home/LawsRegulations.png);
      }
    }
    .box {
      margin: 10px;
      padding: 40px 20px;
      height: 160px;
      width: 100%;
      background: #ffffff;
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      .box-left {
        width: 56%;
        .subtitle-name:hover {
          font-size: 20px;
          font-family: Source Han Sans CN, Source Han Sans CN-Medium;
          font-weight: 500;
          color: #303133;
        }
        .subtitle-name {
          font-size: 20px;
          font-family: Source Han Sans CN, Source Han Sans CN-Medium;
          font-weight: 500;
          color: #606266;
        }
        .notes {
          font-size: 14px;
          font-family: Source Han Sans CN, Source Han Sans CN-Regular;
          font-weight: 400;
          color: #909399;
        }
        .center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .center {
        text-align: center;
        font-size: 18px;
        font-weight: 500;
        color: #909399;
      }
      img {
        cursor: pointer;
        margin-left: 60%;
        margin-top: -80px;
      }

    }
  }
}
</style>

