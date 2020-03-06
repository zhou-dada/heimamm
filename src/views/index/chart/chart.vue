<template>
  <div>
    <!--上面的卡片-->
    <el-card class="box-card">
      <ul>
        <li>
          <span class="circle">{{title.increment_users}}</span>
          <span>今日新增用户</span>
        </li>
        <li>
          <span class="circle">{{title.total_users}}</span>
          <span>总用户量</span>
        </li>
        <li>
          <span class="circle orange">{{title.increment_questions}}</span>
          <span>新增试题</span>
        </li>
        <li>
          <span class="circle orange">{{title.total_questions}}</span>
          <span>总试题量</span>
        </li>
        <li>
          <span class="circle green">{{title.total_done_questions}}</span>
          <span>总刷题量</span>
        </li>
        <li>
          <span class="circle green">{{title.personal_questions}}</span>
          <span>人均刷题量</span>
        </li>
      </ul>
    </el-card>
    <!--下面的卡片-->
    <el-card class="box-card">
      <div ref="main" style="height:571px;"></div>
    </el-card>
  </div>
</template>

<script>
import { getTop, statistics } from "@/api/chart.js";
import echarts from "echarts";
export default {
  data() {
    return {
      title: {},
    };
  },

  mounted() {
    statistics().then(res => {
      if (res.data.code == 200) {
        let names = res.data.data.map(item=>{
            return item.name
        })
        var myChart = echarts.init(this.$refs.main);
        var option = {
          title: {
            text: "整体数据",
            top: 30
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            right: 10,
            top: 30,
            data: names
          },
          series: [
            {
              name: "访问来源",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "30",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:res.data.data
            }
          ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      } else {
        this.$message.error(res.data.message);
      }
    });
  },

  created() {
    getTop().then(res => {
      console.log(res);
      if (res.data.code == 200) {
        this.title = res.data.data;
      }
    });
  }
};
</script>

<style lang="less" scoped>
ul {
  padding: 0;
  display: flex;
  justify-content: space-around;
  list-style: none;

  li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .circle {
      display: flex;
      width: 99px;
      height: 99px;
      border: 2px solid rgba(0, 134, 250, 1);
      border-radius: 50%;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      margin-bottom: 20px;

      &.orange {
        border-color: rgba(221, 147, 120);
        color: rgba(221, 147, 120);
      }

      &.green {
        border-color: rgba(135, 201, 156);
        color: rgba(135, 201, 156);
      }

      span {
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>