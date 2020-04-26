package cn.worken.demo.config;

import cn.worken.common.config.BaseDbConfig;
import com.alibaba.druid.pool.DruidDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
@MapperScan(basePackages = {
        "cn.worken.demo.application.domain.mapper"}, sqlSessionTemplateRef = "demoDomainSessionTemplate")
public class DomainDbConfig extends BaseDbConfig {

    @Bean(name = "demoDomainDataSource")
    public DataSource wwDomainDataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        return bindDataSource(dataSource, "hrm", environment);
    }

    @Bean(name = "demoDomainSqlSessionFactory")
    public SqlSessionFactory wwDomainSqlSessionFactory(@Qualifier("demoDomainDataSource") DataSource dataSource) throws Exception {
        String[] resources = new String[]{"classpath*:mapper/domain/*Mapper.xml"};
        String[] typeAliasPkg = new String[]{"cn.worken.demo.application.domain.entity"};
        String[] typeEnumsPkg = new String[]{};

        SqlSessionFactory sessionFactory = buildSqlSessionFactory(dataSource, resources, typeAliasPkg,
                typeEnumsPkg, null);

        return sessionFactory;
    }

    @Bean(name = "demoDomainSessionTemplate")
    public SqlSessionTemplate wwDomainSessionTemplate(@Qualifier("demoDomainSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
