<template>
  <div class="editor">
    <p class="editor-title"><i class="fa fa-pencil-square"></i>&nbsp;请开始你的创作</p>
    <div class="editor-box">
			<label for="title">文章标题：</label>
			<input type="text" placeholder="文章标题" v-model="articleTitle" class="editor-box-input" id="title">
		</div>
		<div class="editor-box">
			<label for="tag">添加标签：</label>
			<input type="text" placeholder="回车添加文章标签" v-model="articleTag" class="editor-box-input" id="tag" @keyup.enter="addTag">
		</div>
		<ul class="editor-box-tag">
			<li v-for="(tag, index) in currentArticle.tags" :key="index">
				<span>{{ tag.name }}</span>&nbsp;&nbsp;
				<i class="fa fa-trash-o" @click="deleteCurrentTag(index)"></i>
			</li>
		</ul>
		<textarea id="editor-area" ></textarea>
		<div class="editor-box-button">
			<button @click="createArticle" v-if="currentArticle.id === -1">创建</button>
			<button @click="saveArticle({button: true})" v-else>保存</button>
			<template v-if="currentArticle.id !== -1">
				<button @click="publishArticle" v-if="!currentArticle.publish">发布</button>
				<button @click="notPublishArticle" v-else>撤回发布</button>
			</template>
			<button @click="deleteArticle">删除</button>
		</div>
  </div>
</template>
<script>
import { mapGetters ,mapActions, mapMutations } from 'vuex';
import SimpleMDE from 'simplemde';
import css from 'simplemde/dist/simplemde.min.css';

import debounce from '../../lib/debounce.js';
import marked from '../../lib/marked.js';

let simplemde;

export default {
	name: 'editor',
	data(){
		return {
			articleTag: '',
			articleTitle: '',
			articleTag: '',
		}
	},
	computed: {
		...mapGetters([
			'currentArticle',
		])
	},
	mounted(){
		//组件装载完毕后将当前文章渲染到编辑器中
		//下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM
		this.$nextTick(() => {
			this.articleTitle = this.currentArticle.title;
			this.articleContent = this.currentArticle.content;
			simplemde.value(this.articleContent);
		});

		simplemde = new SimpleMDE({
			autoDownloadFontAwesome: false,
			element: document.getElementById("editor-area"),
			spellChecker: false,
			previewRender: function(plainText){
				return marked(plainText);	// Returns HTML from a custom parser
			}
		});
		//simplemde支持change事件
		simplemde.codemirror.on("change", () => {
			let value = simplemde.value();
			//如果区域内容与当前文章内容相同就不进行保存
			if(this.currentArticle.content === value){
				return;
			}
			//如果文章已经保存,则修改文章状态 => 未保存
			if(this.currentArticle.save){
				this.$store.dispatch("CHANGE_ARTICLE");
			}
			this.articleContent = value;
		})
	},
	methods: {
		...mapActions([
			'GET_ALL_TAGS',
			'GET_ALL_ARTICLES',
			'GET_CURRENT_ARTICLE',
		]),
		//删除当前文章的标签
		deleteCurrentTag(index){
			this.$confirm("是否删除该标签？", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				this.$store.dispatch("DELETE_CURRENT_TAG",index).then((res) => {
					if(this.currentArticle.id !== -1){
						this.saveArticle();
					}
					this.GET_ALL_TAGS();
				});
			}).catch((err) => {
				
			});
		},
		//保存文章并引入防抖操作
		saveArticle: debounce(function({
			title = this.articleTitle,
			content = this.articleContent,
			button = false
		}){
			let abstract;
			if(content.indexOf("<!--more-->") !== -1){
				abstract = content.split("<!--more-->")[0];
			}else{
				this.$message.error("请填写摘要");
				return;
			}
			const article = {
				title: title,
				content: content,
				abstract: abstract,
				tags: this.currentArticle.tags,
				lastEditTime: new Date()
			};

			this.$store.dispatch("SAVE_ARTICLE", {
				id: this.currentArticle.id,
				article
			}).then((res) => {
				if(res.data.success && button){
					this.$message({
						message: "保存成功",
						type: "success"
					});
					this.GET_ALL_ARTICLES();
				}
			}).catch(err => {
				this.$message.error(err.response.data.error);
			});
		}),
		createArticle(){
			const article = {
				title: this.articleTitle,
				content: this.articleContent,
				tags: this.currentArticle.tags,
				publish: false
			};

			this.$store.dispatch("CREATE_ARTICLE", article).then((res) => {
				if(res.data.success){
					this.$message({
						message: "文章创建成功",
						type: "success"
					});
					//文章创建成功之后，清空创建文章过程中选中的标签
					this.clearSelect();
				}
			}).catch((err) => {
				// console.log(err.response);
				this.$message.error(err.response.data.error);
			})
		},
		clearSelect(){
			return this.$store.commit("clear_select_tag");
		},
		publishArticle(){
			this.$store.dispatch("PUBLISH_ARTICLE", this.currentArticle.id).then((res) => {
				if(res.data.success){
					this.$message({
						message: "文章发布成功",
						type: "success"
					});
				}
			})
		},
		notPublishArticle(){
			this.$store.dispatch("NOT_PUBLISH_ARTICLE", this.currentArticle.id).then((res) => {
				if(res.data.success){
					this.$message({
						message: "文章撤回发布成功",
						type: "success"
					});
				}
			})
		},
		deleteArticle(){
			this.$confirm("此操作将永久删除该文章,是否继续", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				console.log(this.currentArticle.id);
				if(this.currentArticle.id === -1){
					this.GET_CURRENT_ARTICLE(0);
					return;
				}

				this.$store.dispatch("DELETE_ARTICLE", this.currentArticle.id).then((res) => {
					if(res.data.success){
						this.$message({
							message: "文章删除成功",
							type: "success"
						});
						this.GET_ALL_ARTICLES();
					}
				}).catch((err) => {
					this.$message.error(err.response.data.error);
				});
			}).catch(() => {
				this.$message({
					message: "已取消删除",
					type: "info"
				});
			});
		},
		addTag(){
			if(this.currentArticle.tags.find(item => item.name === this.articleTag)){
				this.$message.error("该标签已存在");
			}else{
				if(this.currentArticle.tags.length >= 5){
					this.$message({
						message: "最多只能创建5个标签",
						type: "error"
					});
					return;
				}

				this.$store.dispatch("CREATE_TAG",{
					name: this.articleTag
				}).then((res) => {
					if(res.data.success){
						this.$message({
							message: "标签创建成功",
							type: "success"
						});
						this.GET_ALL_TAGS();
						this.articleTag = "";
						//若该文章不是新建的，则修改所对应的标签后应该对其文章模型进行修改保存
						if(this.currentArticle.id !== -1){
							this.saveArticle();
						}
					}
				}).catch((err) => {
					this.$message.error(err.response.data.error);
				});
			}
		}
	},
	watch: {
		currentArticle(val, oldVal){
			this.articleTitle = val.title;
			this.articleContent = val.content;
			this.articleTag = "";
			if(oldVal.id !== val.id && simplemde.isPreviewActive()){
				simplemde.togglePreview();
			}
			simplemde.value(this.articleContent);
		},
		articleTitle(val, oldVal){
			//文章标题变化且不是新建文章则保存
			if(this.currentArticle.title !== val && this.currentArticle.id !== -1){
				//修改当前文章状态为未保存
				this.$store.dispatch("CHANGE_ARTICLE");
				this.saveArticle({
					title: val
				});
			}
		}
	}
}
</script>

<style lang="less" scoped>
	.editor{
		padding: 15px;
		input{
			padding: 7px;
			background-color: #EFEFEF;
			width: 350px;
			border: 0;
			font-size: 15px;
		}
		&-title{
			margin-top: 0;
			font-size: 25px;
			color: #0089D7;
		}
		&-box{
			font-size: 17px;
			margin: 10px 0;
			label{
				font-size: 14px;
				font-weight: bold;
			}
		}
		&-box-tag{
			list-style-type: none;
			padding: 0;
			overflow: hidden;
			li{
				float: left;
				font-size: 14px;
				margin:0 5px;
				text-align: center;
				cursor: pointer;
				padding: 5px;
				border-radius: 5px;
				background-color: #EFEFEF;
				&:hover{
					background-color: #0089D7;
					color: white;
				}
			}
		}
		&-box-button{
			float: right;
			margin: 10px;
			button{
				width: 80px;
				padding: 5px;
				text-align: center;
				background-color: #0089D7;
				color: white;
				margin-left: 15px;
				border-radius: 3px;
				font-size: 15px;
				border: 0;
				cursor: pointer;
			}
		}
	}
</style>
