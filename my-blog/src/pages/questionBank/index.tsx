import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckOutlined,
  CloseOutlined,
  HomeOutlined,
  RocketOutlined,
  RollbackOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import { useLocation, history, useModel } from 'umi';
import { Empty, message, Modal, Button } from 'antd';
import _ from 'lodash';
import CountDown from '@/components/CountDown';
import { httpGet, httpPost } from '@/utils/request';
import Comments from '@/components/Comments';
import { useUnmount } from '@umijs/hooks';
import { TokenUtils } from '@/utils/token';
import CommentItem from './Components/commentItem';
import styles from './index.less';


interface Props { }
const QuestionBank: React.FC<Props> = (props) => {
  /**题库 */
  const [questionList, setQuestionList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [visible, setVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [percent, setPercent] = useState(0);
  const renderList = (list: any, olList: any) => {
    const arr = [...list];
    arr.forEach((item) => {
      const child = olList.filter((obj: any) => obj.parentId === item.commentId);
      if (child.length) {
        item.children = child;
        renderList(item.children, olList);
      }
    });
    return arr;
  };
  const { current, correct, answerOptions, commentList }: any = useMemo(() => {
    const _current: any = questionList?.[currentIndex - 1] ?? {};
    let _correct: any[] = [];
    let _answerOptions = [];
    switch (_current.questionType) {
      /**单选题 */
      case 1: {
        _correct = [_current.correctAnswer];
        _answerOptions = _current.answerOptions
          ? _current.answerOptions.split('//')
          : [];
        console.log(_answerOptions);
        break;
      }
      /**多选题 */
      case 2: {
        _correct = _current.correctAnswer.split(',');
        _answerOptions = _current.answerOptions
          ? _current.answerOptions.split('//')
          : [];
        break;
      }
      /**判断题 */
      case 3: {
        _correct = [_current.correctAnswer];
        _answerOptions = ['错误', '正确'];
        break;
      }
    }
    let _commentList = [];
    if (_current.questionComments) {
      _commentList = renderList(
        _current.questionComments.filter((item: any) => item.parentId === null),
        _current.questionComments,
      );
    }
    return {
      current: _current,
      correct: _correct,
      answerOptions: _answerOptions,
      commentList: _commentList,
    };
  }, [questionList, currentIndex]);
  const [answerList, setAnswerList] = useState([]);

  const [refresh, setRefresh] = useState(false);
  const [selectItem, setSelectItem] = useState<string[]>([]);
  const [showcorrect, setShowcorrect] = useState(false);

  const [showInput, setShowInput] = useState(false);
  const isSelect = selectItem.length > 0;
  const _location: any = useLocation();
  const { query } = _location;
  const disabled = !!query.id;

  const loadData = () => {
    if (query.id) {
      httpGet('/auth/questionBank/getList', { categoryId: query.id }).then(
        ({ success, data }) => {
          if (success) {
            setQuestionList(data);
          }
        },
      );
    } else if (query.questionId) {
      httpGet('/auth/questionBank/getQuestion', { id: query.questionId }).then(
        ({ success, data }) => {
          if (success) {
            setQuestionList([data]);
            setShowcorrect(true);
          }
        },
      );
    }
  };
  const addRecord = () => {
    httpPost('/auth/questionBank/addRecord', {
      categoryId: query.id,
      accuracyRate: percent,
    });
  };
  useEffect(() => {
    loadData();
  }, []);
  useUnmount(() => {
    if (disabled && questionList.length) {
      addRecord();
    }
  });
  const onSubmit = () => {
    const _answerList = _.cloneDeep(answerList);
    let isCorrect = correct.length
      ? correct.length === selectItem.length
      : false;
    correct.forEach((item: any) => {
      if (selectItem.indexOf(item) === -1) {
        isCorrect = false;
      }
    });
    _answerList.push({
      correct,
      isCorrect,
      questionId: current.questionId,
      answer: selectItem,
    });
    setAnswerList(_answerList);
    const total = _answerList.reduce((p: number, n: any) => {
      if (n.isCorrect) {
        p += 1;
      }
      return p;
    }, 0);
    const _percent = Math.floor((100 * total) / questionList.length);
    setPercent(_percent);
    setShowcorrect(true);
  };
  const gotoQuestions = (isNext: boolean) => {
    const index = isNext ? currentIndex + 1 : currentIndex - 1;
    setCurrentIndex(index);
    const _currrent = questionList[index - 1];
    if (_currrent) {
      const target: any = answerList.find(
        (item: any) => item.questionId === _currrent.questionId,
      );
      if (target) {
        setSelectItem(target.answer);
        setShowcorrect(true);
      } else {
        setShowcorrect(false);
        setSelectItem([]);
      }
    } else {
      setShowcorrect(false);
      setSelectItem([]);
    }
  };
  const goNextOrPrev = (isNext = true) => {
    if (isNext && currentIndex === questionList.length) {
      return;
    }
    if (!isNext && currentIndex === 1) {
      return;
    }
    setRefresh(!refresh);
    if (!showcorrect) {
      Modal.confirm({
        title: '提示',
        content: `跳转${isNext ? '下' : '上'}一题，是否提交答案？`,
        onOk: () => {
          onSubmit();
          setTimeout(() => {
            gotoQuestions(isNext);
          }, 1000);
        },
      });
      return;
    }
    gotoQuestions(isNext);
  };
  const answerCorrectFlag = useMemo(() => {
    if (showcorrect) {
      const target: any = answerList.find(
        (item: any) => item.questionId === current.questionId,
      );
      return target ? target.isCorrect : false;
    }
    return false;
  }, [answerList, current]);
  const { addMessage } = useModel('global', (model) => ({
    addMessage: model.addMessage,
  }));
  return (
    <div className={styles.questionBankWrapper}>
      {questionList?.length ? (
        <div>
          {' '}
          <div className={styles.bankContainer}>
            {disabled ? (
              <div className={styles.bankTop}>
                <div className={styles.title}>
                  总题数：
                  <span className={classNames(styles.staticNum, 'text-blue')}>
                    {questionList.length}
                  </span>
                </div>
                <div className={styles.title}>
                  已答完：
                  <span className={classNames(styles.staticNum, 'text-orange')}>
                    {answerList.length}
                  </span>
                </div>
                <div className={styles.title}>
                  准确率：
                  <span className={classNames(styles.staticNum, 'text-red')}>
                    {percent}%
                  </span>
                </div>
                {!showcorrect ? (
                  <div className={styles.countdown}>
                    <CountDown
                      refresh={refresh}
                      onCountOverCaller={() => {
                        /**时间到了，结束答题 */
                        onSubmit();
                      }}
                    >
                      {30}
                    </CountDown>
                  </div>
                ) : (
                  ''
                )}
                <div
                  className={styles.homeBtn}
                  onClick={() => {
                    history.push('/?nav=1');
                  }}
                >
                  <HomeOutlined />
                </div>
              </div>
            ) : (
              ''
            )}
            <div className={styles.qusetionCard}>
              <div className={styles.questionContent}>
                <h2 className={styles.questionTitle}>
                  {current.questionType === 1 ? '单选题' : ''}
                  {current.questionType === 2 ? '多选题' : ''}
                  {current.questionType === 3 ? '判断题' : ''}
                  {query.questionId ? (
                    <div
                      onClick={() => {
                        history.goBack();
                      }}
                      style={{ float: 'right' }}
                    >
                      <RollbackOutlined />
                    </div>
                  ) : (
                    ''
                  )}
                </h2>
                <p>
                  {currentIndex}.{current.questionContent}
                </p>
                {answerOptions.map((item: any, index: number) => {
                  const i = String(index);
                  const isCorrect =
                    selectItem.indexOf(i) > -1 && correct.indexOf(i) > -1;
                  const error =
                    selectItem.indexOf(i) > -1 && correct.indexOf(i) === -1;
                  const _correct =
                    correct.indexOf(i) > -1 && selectItem.indexOf(i) === -1;
                  return (
                    <li
                      className={classNames(styles.selectList, {
                        [styles.active]:
                          !showcorrect && selectItem.indexOf(i) > -1,
                        [styles.correct]: showcorrect && isCorrect,
                        [styles.error]: showcorrect && _correct,
                        [styles.activeError]: showcorrect && error,
                      })}
                      style={{ opacity: showcorrect ? 0.7 : 1 }}
                      key={i}
                      onClick={() => {
                        if (showcorrect) {
                          return;
                        }
                        if (
                          current.questionType === 1 ||
                          current.questionType === 3
                        ) {
                          setSelectItem([i]);
                        } else if (current.questionType === 2) {
                          const _selectItem = _.cloneDeep(selectItem);
                          const index = _selectItem.findIndex((v: string) => v === i);
                          if (index > -1) {
                            _selectItem.splice(index, 1);
                          } else {
                            _selectItem.push(i);
                          }
                          setSelectItem(_selectItem);
                        }
                      }}
                    >
                      <div className={styles.selectWrapper}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item,
                          }}
                          className={styles.htmlWrapper}
                          ref={(dom) => {
                            if (dom) {
                              const list = [...dom.getElementsByTagName('img')];
                              console.log(list);
                              list.forEach((item) => {
                                item.addEventListener(
                                  'click',
                                  (e) => {
                                    e.stopPropagation();
                                    setVisible(true);
                                    setPreviewUrl(item.src);
                                  },
                                  false,
                                );
                              });
                            }
                          }}
                        ></div>
                        <span style={{ marginLeft: 32 }}>
                          {showcorrect && (isCorrect || _correct) ? (
                            <span>正确选项</span>
                          ) : (
                            ''
                          )}
                          {showcorrect && error ? <span>错误选项</span> : ''}
                        </span>
                      </div>
                    </li>
                  );
                })}
                {disabled && !showcorrect ? (
                  <Button
                    style={{ marginTop: 30 }}
                    onClick={() => {
                      if (selectItem.length === 0) {
                        Modal.confirm({
                          title: '提示',
                          content: '你还没有选择答案，是否提交？',
                          onOk: () => {
                            onSubmit();
                          },
                        });
                      } else {
                        onSubmit();
                      }
                    }}
                  >
                    提交答案
                  </Button>
                ) : (
                  ''
                )}
                {showcorrect ? (
                  <div>
                    <p style={{ marginTop: 30, color: '#666' }}>
                      答案解析：{current.answerKeys || '(无)'}
                    </p>
                    {disabled ? (
                      <div style={{ textAlign: 'center', fontSize: 16 }}>
                        {answerCorrectFlag ? (
                          <span className="text-green">
                            <CheckOutlined /> 回答正确
                          </span>
                        ) : (
                          <span className="text-red">
                            <CloseOutlined /> 回答错误
                          </span>
                        )}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
          <div
            className={styles.pageController}
            style={{ display: questionList.length === 1 ? 'none' : '' }}
          >
            <div className={styles.pagerContent}>
              <div
                className={classNames(styles.prev)}
                style={{
                  visibility: currentIndex === 1 ? 'hidden' : undefined,
                }}
                onClick={() => {
                  if (currentIndex === 1) {
                    return;
                  }
                  goNextOrPrev(false);
                  setRefresh(!refresh);
                }}
              >
                上一题
              </div>
              <div
                className={classNames(styles.next)}
                style={{
                  visibility:
                    currentIndex === questionList.length ? 'hidden' : undefined,
                }}
                onClick={() => {
                  if (currentIndex === questionList.length) {
                    return;
                  }
                  goNextOrPrev();
                  setRefresh(!refresh);
                }}
              >
                下一题
              </div>
            </div>
          </div>
          <div className={styles.commentWrapper}>
            <div className={styles['ctrl-input']}>
              <div
                className={styles.title}
                onClick={() => setShowInput(!showInput)}
              >
                <SmileOutlined className={styles.icon} />
                <div className={styles.btn}>
                  {showInput ? '发表评论' : '说点什么'}
                </div>
              </div>
              {showInput ? (
                <Comments
                  onClose={({ username, content }, clb) => {
                    const { userInfo } = TokenUtils.getToken();
                    httpPost('/auth/questionBank/addComment', {
                      content,
                      userName: username,
                      userId: userInfo?.userId,
                      questionId: current.questionId,
                    }).then(({ success, data }) => {
                      if (success) {
                        message.success('评论成功');
                        addMessage({
                          comment: true,
                          title:
                            questionList[currentIndex - 1].category
                              .categoryName,
                          subTitle:
                            questionList[currentIndex - 1].questionContent,
                          objectId: questionList[currentIndex - 1].questionId,
                          typeId: 2,
                        });
                        clb();
                        setShowInput(false);
                        loadData();
                      }
                    });
                  }}
                  articleId={query.id}
                />
              ) : (
                ''
              )}
            </div>
          </div>
          <div className={styles.commentWrapper}>
            <div className={styles['comments-list']}>
              {commentList.length ? (
                <div className={styles.commentList}>
                  {commentList.map((item: any, index: number) => (
                    <CommentItem
                      queryComments={loadData}
                      item={item}
                      index={index}
                      {...{
                        title:
                          questionList[currentIndex - 1].category.categoryName,
                        subTitle:
                          questionList[currentIndex - 1].questionContent,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.empty}>
                  <RocketOutlined className={styles.icon} />
                  还没有评论
                </div>
              )}
            </div>
          </div>
          <Modal
            width={520}
            footer={null}
            visible={visible}
            onCancel={() => setVisible(false)}
          >
            <img
              src={previewUrl}
              alt=""
              style={{ width: '100%', marginTop: 12, userSelect: 'none' }}
            />
          </Modal>
        </div>
      ) : (
        <Empty description="题库空空如也" />
      )}
    </div>
  );
};
export default QuestionBank;
