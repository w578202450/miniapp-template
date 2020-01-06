Page({
  data: {

  },
  onLoad: function () {

  }
})

Component({
  properties: {
    background: {
      type: String,
      value: 'rgba(255,255,255,1)'
    },
    color: {
      type: String,
      value: 'rgba(0,0,0,0.85)'
    },
    normalImage: {
      type: String,
      value: '../../images/public/public_circle_normal.png'
    },
    selectedImage: {
      type: String,
      value: '../../images/public/public_circle_selected.png'
    },
    radioItems: {
      type: Array
    }
  },
  data: {
    
  },
  methods: {
    // 返回事件   
    radioChange: function (e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value);
      this.triggerEvent('radioChange', e.detail.value)
      var checked = e.detail.value
      var changed = {}
      for (var i = 0; i < this.data.radioItems.length; i++) {
        if (checked == this.data.radioItems[i].name){
          changed['radioItems[' + i + '].checked'] = true
        } else{
          changed['radioItems[' + i + '].checked'] = false
        }
        // if (checked.indexOf(this.data.radioItems[i].value) !== -1) {
          
        // } else {
          
        // }
      }
      this.setData(changed)
    } 
  }
})